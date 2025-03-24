"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { usePreloaderStore } from "@/store/preloaderStore";
import styles from "./styles.module.scss";
import { useScrollStore } from "@/store/scrollStore";
import { useInteractiveLinesStore } from "@/store/interactiveLinesStore";
import { useHudMenuStore } from "@/store/hudMenuStore";

export default function Preloader() {
	const { zIndex, verticalLine } = useInteractiveLinesStore();
	const { activeMenu } = useHudMenuStore();
	const { setOnAllScreensReady, setResetPreloaderCallback, triggerResetPreloader } = usePreloaderStore();

	const [progress, setProgress] = useState(0);
	const [linesClass, setLinesClass] = useState(styles.undefined);
	const [allowAnimation, setAllowAnimation] = useState(true);
	const [preloaderClass, setPreloaderClass] = useState(styles.undefined);
	const [loading, setLoading] = useState(true);
	const { setScrollAllowed } = useScrollStore();
	const pathname = usePathname();
	const prevPath = useRef<string | null>(null);

	const preloaderRef = useRef<HTMLDivElement | null>(null);
	const linesBlockRef = useRef<HTMLDivElement | null>(null);

	const targetProgress = useRef(0);
	const currentProgress = useRef(0);
	const lastUpdateTime = useRef(performance.now());
	const started = useRef(false);
	const animationStarted = useRef(false);
	const lastLinesUpdate = useRef(Date.now());

	const animateProgress = () => {
		if (animationStarted.current) return;
		animationStarted.current = true;

		const loop = () => {
			const now = performance.now();
			const deltaTime = now - lastUpdateTime.current;
			lastUpdateTime.current = now;

			let step;
			if (targetProgress.current < 95) {
				step = (targetProgress.current - currentProgress.current) / (500 / deltaTime);
			} else {
				step = (targetProgress.current - currentProgress.current) / (100 / deltaTime);
			}

			currentProgress.current = Math.min(currentProgress.current + step, targetProgress.current);
			const floored = Math.floor(currentProgress.current);

			if (floored >= 99 && targetProgress.current === 100) {
				currentProgress.current = 100;
				setProgress(100);
				setScrollAllowed(true);
				setTimeout(() => setLoading(false), 500);
				return;
			}

			setProgress(floored);
			requestAnimationFrame(loop);
		};

		requestAnimationFrame(loop);
	};

	useLayoutEffect(() => {
		animateProgress();
	}, []);

	useEffect(() => {
		setTimeout(() => {
			if (targetProgress.current === 0) {
				targetProgress.current = 100;
			}
		}, 3000); // если через 4 сек что-то не догрузилось — форсим 100%

		const startLoader = () => {
			started.current = true;
			const images = Array.from(document.images);
			const total = images.length;

			if (total === 0) {
				targetProgress.current = 100;
				return;
			}

			let loaded = 0;
			const loadImage = (img: HTMLImageElement) =>
				new Promise<void>((resolve) => {
					if (img.complete) {
						resolve();
					} else {
						img.addEventListener("load", () => resolve());
						img.addEventListener("error", () => resolve());
					}
				}).then(() => {
					loaded++;
					targetProgress.current = Math.floor((loaded / total) * 100);
				});

			Promise.all(images.map(loadImage)).then(() => {
				targetProgress.current = 100;
			});
		};

		setOnAllScreensReady(() => {
			startLoader();
		});

		setResetPreloaderCallback(async () => {
			started.current = false;
			animationStarted.current = false;
			targetProgress.current = 0;
			currentProgress.current = 0;
			lastUpdateTime.current = performance.now();

			setLoading(true);
			setLinesClass(styles.undefined);
			setPreloaderClass(styles.active);
			verticalLine.setNewX(50);

			return new Promise((resolve) => {
				requestAnimationFrame(() => {
					requestAnimationFrame(() => {
						setProgress(0);

						// получаем скорость анимации у прелоадера!
						const styles = window.getComputedStyle(preloaderRef.current!);
						const durationStr = styles.getPropertyValue("transition-duration"); // например, "0.75s"
						const delayStr = styles.getPropertyValue("transition-delay"); // если нужно
						const duration = parseFloat(durationStr) * 1000;
						const delay = parseFloat(delayStr) * 1000 || 0;
						const totalDelay = duration + delay;

						setTimeout(() => {
							animateProgress();
							resolve();
						}, totalDelay);
					});
				});
			});
		});
	}, []);

	useEffect(() => {
		if (prevPath.current !== null && prevPath.current !== pathname) {
			triggerResetPreloader?.();
		}
		prevPath.current = pathname;
	}, [pathname]);

	useEffect(() => {
		if (allowAnimation) {
			if (progress >= 100) {
				setLinesClass(styles.navCursor);
				setPreloaderClass(styles.hidden);
				setAllowAnimation(false);
			} else if (progress >= 80) {
				setLinesClass(styles.step4);
				setPreloaderClass(styles.undefined);
				setAllowAnimation(false);
			} else if (progress >= 60) {
				setLinesClass(styles.step3);
				setPreloaderClass(styles.undefined);
				setAllowAnimation(false);
			} else if (progress >= 40) {
				setLinesClass(styles.step2);
				setPreloaderClass(styles.undefined);
				setAllowAnimation(false);
			} else if (progress >= 20) {
				setLinesClass(styles.step1);
				setPreloaderClass(styles.undefined);
				setAllowAnimation(false);
			}
		}
	}, [progress, allowAnimation]);

	useEffect(() => {
		if (allowAnimation === false) {
			setTimeout(() => {
				setAllowAnimation(true);
			}, 1500);
		}
	}, [allowAnimation]);

	useEffect(() => {
		if (progress >= 100) {
			preloaderRef.current?.style.setProperty("z-index", zIndex.toString());
		}
		if (preloaderClass != styles.hidden) {
			preloaderRef.current?.style.setProperty("z-index", "10");
		}
	}, [zIndex, preloaderClass]);

	useEffect(() => {
		linesBlockRef.current?.style.setProperty("left", `${verticalLine.x}%`);
		linesBlockRef.current?.style.setProperty("transition", "all 1s");
	}, [verticalLine.x]);

	useEffect(() => {
		if (activeMenu || preloaderClass != styles.hidden) {
			preloaderRef.current?.style.removeProperty("transition");
			linesBlockRef.current?.style.removeProperty("transition");
		} else {
			preloaderRef.current?.style.setProperty("transition", "all 1s 0s, z-index 0s 0.5s");
		}
	}, [activeMenu, preloaderClass]);

	return (
		<div ref={preloaderRef} className={`${styles.preloader} ${preloaderClass}`}>
			<div className="screenContent">
				<div ref={linesBlockRef} className={`${styles.linesBlock} ${linesClass}`}>
					<div className={styles.leftLines}>
						<div className={styles.line} />
						<div className={styles.line} />
					</div>
					<div className={styles.centerLines}>
						<div className={styles.line} />
					</div>
					<div className={styles.rightLines}>
						<div className={styles.line} />
					</div>
					<div className={`${styles.imagesBlock}`}>
						<div className={styles.image}>
							<img src="/images/preloader/1.png" />
						</div>
						<div className={styles.image}>
							<img src="/images/preloader/2.png" />
						</div>
						<div className={styles.image}>
							<img src="/images/preloader/3.png" />
						</div>
						<div className={styles.image}>
							<img src="/images/preloader/4.png" />
						</div>
						<div className={styles.image}>
							<img src="/images/preloader/5.png" />
						</div>
					</div>
					<div className={styles.number}>{progress}%</div>
				</div>
			</div>
		</div>
	);
}
