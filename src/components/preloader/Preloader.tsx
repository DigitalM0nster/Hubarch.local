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

	const animationFrameRef = useRef<number | null>(null);

	const preloaderRef = useRef<HTMLDivElement | null>(null);
	const linesBlockRef = useRef<HTMLDivElement | null>(null);

	const initialValue = typeof window !== "undefined" ? window.__initialProgress ?? 0 : 0;
	const currentProgress = useRef(initialValue);
	const targetProgress = useRef(20);
	const lastUpdateTime = useRef(performance.now());

	/* eslint-disable react-hooks/exhaustive-deps */
	const animateProgress = useCallback(() => {
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
			animationFrameRef.current = requestAnimationFrame(loop);
		};

		animationFrameRef.current = requestAnimationFrame(loop);
	}, []);

	useLayoutEffect(() => {
		animateProgress();
	}, []);

	useEffect(() => {
		// const timeout = setTimeout(() => {
		// 	if (!started.current) {
		// 		targetProgress.current = 100;
		// 		animateProgress();
		// 	}
		// }, 5000); // 5 секунд

		const startLoader = () => {
			const screenContainer = document.querySelector(".screenScroll");
			if (!screenContainer) {
				targetProgress.current = 100;
				return;
			}

			let observer: MutationObserver | null = null;
			let timeoutId: NodeJS.Timeout;

			const waitForImages = () => {
				const images = Array.from(screenContainer.querySelectorAll("img")).filter((img) => img.src && img.src.trim() !== "");

				if (images.length === 0) {
					targetProgress.current = 100;
					return;
				}

				let loaded = 0;

				const checkAllLoaded = () => {
					loaded++;
					targetProgress.current = Math.floor((loaded / images.length) * 100);

					if (loaded === images.length) {
						targetProgress.current = 100;
						observer?.disconnect();
						clearTimeout(timeoutId);
					}
				};

				for (const img of images) {
					if (img.complete) {
						checkAllLoaded();
					} else {
						img.addEventListener("load", checkAllLoaded, { once: true });
						img.addEventListener(
							"error",
							() => {
								alert(`❌ Ошибка загрузки изображения: ${img.src}`);
								checkAllLoaded();
							},
							{ once: true }
						);
					}
				}

				timeoutId = setTimeout(() => {
					alert("⏱️ Время ожидания загрузки изображений истекло");
					targetProgress.current = 100;
					observer?.disconnect();
				}, 8000);
			};

			observer = new MutationObserver(() => {
				const hasImages = screenContainer.querySelectorAll("img").length > 0;
				if (hasImages) {
					observer?.disconnect();
					waitForImages();
				}
			});

			observer.observe(screenContainer, {
				childList: true,
				subtree: true,
			});

			// На случай, если всё уже есть
			waitForImages();
		};

		setOnAllScreensReady(() => {
			alert("все экраны готовы"); // 👈 здесь появится алерт
			startLoader();
		});

		setResetPreloaderCallback(async () => {
			if (animationFrameRef.current !== null) {
				cancelAnimationFrame(animationFrameRef.current);
				animationFrameRef.current = null;
			}

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
							<img src="/images/preloader/1.png" alt="" width={1550} height={1100} />
						</div>
						<div className={styles.image}>
							<img src="/images/preloader/2.png" alt="" width={1550} height={1100} />
						</div>
						<div className={styles.image}>
							<img src="/images/preloader/3.png" alt="" width={1550} height={1100} />
						</div>
						<div className={styles.image}>
							<img src="/images/preloader/4.png" alt="" width={1550} height={1100} />
						</div>
						<div className={styles.image}>
							<img src="/images/preloader/5.png" alt="" width={1550} height={1100} />
						</div>
					</div>
					<div className={`number ${styles.number}`}>{`${progress}%`}</div>
				</div>
			</div>
		</div>
	);
}
