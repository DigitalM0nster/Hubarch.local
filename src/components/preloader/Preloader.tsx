// src\components\preloader\Preloader.tsx
"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { usePreloaderStore } from "@/store/preloaderStore";
import styles from "./styles.module.scss";
import { useScrollStore } from "@/store/scrollStore";
import { useInteractiveLinesStore } from "@/store/interactiveLinesStore";
import { useAllOptionsStore } from "@/store/allOptionsStore";

export default function Preloader() {
	const {
		setResetPreloaderCallback,
		triggerResetPreloader,
		progress,
		setProgress,
		pageState,
		setPageState,
		isProjectLoading,
		setIsProjectLoading,
		projectImage,
		setProjectImage,
		imageRect,
		setImageRect,
		cachedImages,
	} = usePreloaderStore();

	const { preloaderData } = useAllOptionsStore();

	const { verticalLine, horizontalLine, linesOpacity, zIndex, isScreenScrolling } = useInteractiveLinesStore();

	const { setScrollAllowed } = useScrollStore();
	const pathname = usePathname();
	const prevPath = useRef<string | null>(null);

	const animationFrameRef = useRef<number | null>(null);
	const targetIntervalRef = useRef<number | null>(null);
	const styleIntervalRef = useRef<number | null>(null);

	const preloaderRef = useRef<HTMLDivElement | null>(null);
	const imageRef = useRef<HTMLDivElement | null>(null);

	const currentProgress = useRef(1);
	const targetProgress = useRef(18);
	const lastUpdateTime = useRef(performance.now());

	// Состояние для типа прелоадера
	const [preloaderStyle, setPreloaderStyle] = useState<string>("type1");

	// Функция для циклического изменения стиля прелоадера
	const startStyleChangeInterval = useCallback(() => {
		// Очищаем предыдущий интервал, если он существует
		if (styleIntervalRef.current !== null) {
			setPreloaderStyle("type1");
			clearInterval(styleIntervalRef.current);
			styleIntervalRef.current = null;
		}

		// Создаем новый интервал для изменения стиля каждые 2 секунды
		styleIntervalRef.current = window.setInterval(() => {
			setPreloaderStyle((prevStyle) => {
				switch (prevStyle) {
					case "type1":
						return "type2";
					case "type2":
						return "type3";
					case "type3":
						return "type4";
					case "type4":
						return "type1";
					default:
						return "type1";
				}
			});
		}, 2000); // 2000 мс = 2 секунды
	}, []);

	// Функция для циклического изменения стиля прелоадера
	const startTargetInterval = useCallback(() => {
		// Очищаем предыдущий интервал, если он существует
		if (targetIntervalRef.current !== null) {
			clearInterval(targetIntervalRef.current);
			targetIntervalRef.current = null;
		}

		// Создаем новый интервал для изменения стиля каждые 2 секунды
		targetIntervalRef.current = window.setInterval(() => {
			targetProgress.current = Math.min(targetProgress.current + 18, 100);
		}, 1000); // 2000 мс = 2 секунды
	}, []);

	// Функция, которая выполняется ПЕРЕД переходом по ссылке
	const beforeNavigation = useCallback(async () => {
		// Останавливаем текущую анимацию прогресса
		if (animationFrameRef.current !== null) {
			cancelAnimationFrame(animationFrameRef.current);
			animationFrameRef.current = null;
		}

		// Останавливаем интервал, если он существует
		if (targetIntervalRef.current !== null) {
			clearInterval(targetIntervalRef.current);
			targetIntervalRef.current = null;
		}

		// Сбрасываем состояние прелоадера
		setPageState("loading");
		lastUpdateTime.current = performance.now();
		currentProgress.current = 1;
		targetProgress.current = 18;
		setProgress(1);

		return new Promise<void>((resolve) => {
			requestAnimationFrame(() => {
				requestAnimationFrame(() => {
					// Получаем скорость анимации у прелоадера
					const styles = window.getComputedStyle(preloaderRef.current!);
					const durationStr = styles.getPropertyValue("transition-duration");
					const delayStr = styles.getPropertyValue("transition-delay");
					const duration = parseFloat(durationStr) * 1000;
					const delay = parseFloat(delayStr) * 1000 || 0;
					const totalDelay = duration + delay;

					// Запускаем анимацию прогресса
					animateProgress();

					// Запускаем интервал изменения стиля
					startStyleChangeInterval();

					setTimeout(() => {
						resolve();
					}, totalDelay);
				});
			});
		});
	}, [startStyleChangeInterval, pageState]);

	// Функция, которая выполняется ПОСЛЕ перехода по ссылке
	const afterProgress100 = useCallback(() => {
		setPageState("ready");
		setScrollAllowed(true);

		// Останавливаем интервал изменения стиля
		if (styleIntervalRef.current !== null) {
			clearInterval(styleIntervalRef.current);
			styleIntervalRef.current = null;
		}

		new Promise<void>((resolve) => {
			requestAnimationFrame(() => {
				requestAnimationFrame(() => {
					// Получаем скорость анимации у прелоадера
					const styles = window.getComputedStyle(preloaderRef.current!);
					const durationStr = styles.getPropertyValue("transition-duration");
					const delayStr = styles.getPropertyValue("transition-delay");
					const duration = parseFloat(durationStr) * 1000;
					const delay = parseFloat(delayStr) * 1000 || 0;
					const totalDelay = duration + delay;

					setTimeout(() => {
						setProjectImage("");
						setImageRect(null);
						setIsProjectLoading(false);
						setScrollAllowed(true);
						resolve();
					}, totalDelay);
				});
			});
		});
	}, [progress, pageState]);

	const animateProgress = useCallback(() => {
		if (preloaderRef.current) {
			preloaderRef.current.dataset.status = "activated";
		}
		startTargetInterval();

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

	useEffect(() => {
		// Регистрируем функцию, которая будет вызвана перед переходом
		setResetPreloaderCallback(beforeNavigation);

		// Запускаем анимацию прогресса
		animateProgress();

		// Запускаем интервал изменения стиля
		startStyleChangeInterval();

		// Очищаем интервалы при размонтировании компонента
		return () => {
			if (targetIntervalRef.current !== null) {
				clearInterval(targetIntervalRef.current);
				targetIntervalRef.current = null;
			}

			if (styleIntervalRef.current !== null) {
				clearInterval(styleIntervalRef.current);
				styleIntervalRef.current = null;
			}
		};
	}, [beforeNavigation, startStyleChangeInterval]);

	useEffect(() => {
		if (progress >= 100) {
			afterProgress100();
		}
	}, [progress]);

	useEffect(() => {
		// console.log(pageState, progress);
		if (pageState === "ready" && progress >= 100) {
			// Останавливаем интервал изменения стиля
			if (styleIntervalRef.current !== null) {
				clearInterval(styleIntervalRef.current);
				styleIntervalRef.current = null;
			}
		}
	}, [pageState, progress, pathname]);

	useEffect(() => {
		if (pageState === "ready") {
			targetProgress.current = 100;
		}
	}, [pageState]);

	useEffect(() => {
		setPageState("loading");
	}, []);

	return (
		<div
			ref={preloaderRef}
			// className={`preloader ${styles.preloader} ${styles.loading} ${isProjectLoading ? styles.loadingProject : ""} ${styles.type4} ${projectImage ? styles.disabled : ""}`}
			className={`preloader ${styles.preloader} ${pageState === "ready" && progress >= 100 && styles.hidden} ${pageState != "default" && progress < 100 && styles.loading} ${
				isProjectLoading ? styles.loadingProject : ""
			} ${styles[preloaderStyle]} ${projectImage ? styles.disabled : ""} ${isScreenScrolling ? styles.scrolling : ""}`}
			style={{
				zIndex: pageState === "ready" && progress >= 100 ? zIndex : "",
			}}
		>
			<div className={styles.background} />
			<div className={`screenContent ${styles.screenContent}`}>
				<div
					className={styles.hubarchLogo}
					style={{
						top: pageState === "ready" && progress >= 100 ? `${horizontalLine.y}%` : "50%",
						left: pageState === "ready" && progress >= 100 ? `${verticalLine.x}%` : "50%",
						opacity: pageState === "ready" && progress >= 100 ? linesOpacity : "",
						transition: pageState === "ready" && progress >= 100 ? "all 1s 0s" : "",
					}}
				>
					<div className={styles.leftMiniLine}></div>
					<div className={styles.leftLine}></div>
					<div className={styles.centerLine}></div>
					<div className={styles.rightLine}></div>
				</div>
				<div className={`${styles.imagesBlock}`}>
					<div className={styles.image}>{/* <img src="/images/preloader/1.png" alt="hubarch preloader image1" /> */}</div>
					<div className={styles.image}>
						<img src={preloaderData?.image_1 || "/images/preloader/2.png"} alt="hubarch preloader image2" />
					</div>
					<div className={styles.image}>
						<img src={preloaderData?.image_2 || "/images/preloader/3.png"} alt="hubarch preloader image3" />
					</div>
					<div className={styles.image}>
						<img src={preloaderData?.image_3 || "/images/preloader/4.png"} alt="hubarch preloader image4" />
					</div>
					<div className={styles.image}>
						<img src={preloaderData?.image_4 || "/images/preloader/5.png"} alt="hubarch preloader image4" />
					</div>
				</div>
				<div className={styles.progressBar}>
					<div className={styles.progressLine}>
						<div className={styles.currentLine} style={{ width: `${progress}%` }} />
					</div>
					<div className={styles.progress}>{progress}%</div>
				</div>
			</div>
			<div
				ref={imageRef}
				className={`${styles.image} ${projectImage ? styles.active : ""}`}
				style={{
					top: pageState === "ready" && progress >= 100 ? "0%" : imageRect?.top,
					left: pageState === "ready" && progress >= 100 ? "0%" : imageRect?.left,
					width: pageState === "ready" && progress >= 100 ? "100%" : imageRect?.width,
					height: pageState === "ready" && progress >= 100 ? "100%" : imageRect?.height,
					opacity: pageState === "ready" && progress >= 100 ? "0" : projectImage != false ? imageRect?.opacity : 0,
					transition: pageState === "ready" && progress >= 100 ? "all 0.3s 0s, opacity 0.25s 0.3s" : imageRect?.transition,
				}}
			>
				{cachedImages.map((image, index) => {
					if (image.src != false) {
						return (
							<img
								src={image.src}
								alt="project"
								key={`${image.src}-${index}`}
								className={projectImage === image.src ? styles.active : ""}
								style={{
									width: imageRect?.innerImageWidth,
									height: imageRect?.innerImageHeight,
									transition: pageState === "ready" && progress >= 100 ? "all 0.55s 0s" : imageRect?.transition,
								}}
							/>
						);
					}
				})}
				<div className={styles.overlay} />
			</div>
		</div>
	);
}
