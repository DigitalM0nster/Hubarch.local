// src\components\preloader\Preloader.tsx
"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { usePreloaderStore } from "@/store/preloaderStore";
import styles from "./styles.module.scss";
import { useScrollStore } from "@/store/scrollStore";
import { useInteractiveLinesStore } from "@/store/interactiveLinesStore";
import { useHudMenuStore } from "@/store/hudMenuStore";
import Image from "next/image";
import LinkWithPreloader from "./LinkWithPreloader";

declare global {
	interface Window {
		__initialProgress?: number;
	}
}

export default function Preloader() {
	const { zIndex, verticalLine, horizontalLine } = useInteractiveLinesStore();
	const { activeMenu } = useHudMenuStore();
	const { setOnAllScreensReady, setResetPreloaderCallback, triggerResetPreloader, progress, setProgress } = usePreloaderStore();

	const [linesClass, setLinesClass] = useState(styles.undefined);
	const [allowAnimation, setAllowAnimation] = useState(true);
	const [preloaderClass, setPreloaderClass] = useState(styles.undefined);

	const [hasTimedOut, setHasTimedOut] = useState(false);

	const { setScrollAllowed } = useScrollStore();
	const pathname = usePathname();
	const prevPath = useRef<string | null>(null);

	const preloaderRef = useRef<HTMLDivElement | null>(null);
	const linesBlockRef = useRef<HTMLDivElement | null>(null);

	const initialValue = typeof window !== "undefined" ? window.__initialProgress ?? 0 : 0;
	// setProgress(initialValue);
	const currentProgress = useRef(initialValue);
	const targetProgress = useRef(20);
	const lastUpdateTime = useRef(performance.now());
	const started = useRef(false);
	const animationStarted = useRef(false);

	/* eslint-disable react-hooks/exhaustive-deps */
	const animateProgress = useCallback(() => {
		if (animationStarted.current) return;
		animationStarted.current = true;
		if (preloaderRef.current) {
			preloaderRef.current.dataset.status = "activated";
		}

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
				return;
			}

			setProgress(floored);
			requestAnimationFrame(loop);
		};

		requestAnimationFrame(loop);
	}, []);

	useLayoutEffect(() => {
		animateProgress();
	}, []);

	useEffect(() => {
		setHasTimedOut(false);
		const timeout = setTimeout(() => {
			if (!started.current) {
				setHasTimedOut(true);
				targetProgress.current = 100;
				animateProgress();
			}
		}, 5000); // 5 секунд

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
			clearTimeout(timeout); // если данные успели прийти — отменяем ошибку
			startLoader();
		});

		setResetPreloaderCallback(async () => {
			started.current = false;
			animationStarted.current = false;
			targetProgress.current = 0;
			currentProgress.current = 0;
			lastUpdateTime.current = performance.now();

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
	}, [pathname]);

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
		if (progress >= 100) {
			setTimeout(() => {
				setScrollAllowed(true);
			}, 750);
		}
	}, [allowAnimation, progress]);

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
		linesBlockRef.current?.style.setProperty("top", `${horizontalLine.y}%`);
		linesBlockRef.current?.style.setProperty("transition", "all 1s");
	}, [horizontalLine.y]);

	useEffect(() => {
		if (activeMenu || preloaderClass != styles.hidden) {
			preloaderRef.current?.style.removeProperty("transition");
			linesBlockRef.current?.style.removeProperty("transition");
		} else {
			preloaderRef.current?.style.setProperty("transition", "all 1s 0s, z-index 0s 0.5s");
		}
	}, [activeMenu, preloaderClass]);
	/* eslint-enable react-hooks/exhaustive-deps */

	return (
		<div ref={preloaderRef} className={`preloader ${styles.preloader} ${preloaderClass} ${hasTimedOut ? styles.timeout : ""}`}>
			<div className="screenContent">
				<div className={styles.errorBlock}>
					<h2>Не удалось загрузить данные на сайт</h2>
					<p>Что-то пошло не так. Попробуйте вернуться на главную или перезагрузить страницу.</p>
					<div className={styles.buttonsBlock}>
						<LinkWithPreloader href="/" className={styles.mainButtton}>
							Вернуться на главную
						</LinkWithPreloader>
						{/* <p>или</p> */}
						<button className={styles.button} onClick={() => location.reload()}>
							Перезагрузить
						</button>
					</div>
				</div>
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
							<Image src="/images/preloader/1.png" alt="" width={1550} height={1100} priority />
						</div>
						<div className={styles.image}>
							<Image src="/images/preloader/2.png" alt="" width={1550} height={1100} />
						</div>
						<div className={styles.image}>
							<Image src="/images/preloader/3.png" alt="" width={1550} height={1100} />
						</div>
						<div className={styles.image}>
							<Image src="/images/preloader/4.png" alt="" width={1550} height={1100} />
						</div>
						<div className={styles.image}>
							<Image src="/images/preloader/5.png" alt="" width={1550} height={1100} />
						</div>
					</div>
					<div className={`number ${styles.number}`}>{typeof window === "undefined" ? `${progress}%` : progress + "%"}</div>
				</div>
			</div>
		</div>
	);
}
