// src\components\preloader\Preloader.tsx
"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { usePreloaderStore } from "@/store/preloaderStore";
import styles from "./styles.module.scss";
import { useScrollStore } from "@/store/scrollStore";
import { useInteractiveLinesStore } from "@/store/interactiveLinesStore";

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
	} = usePreloaderStore();

	const { verticalLine, horizontalLine, linesOpacity } = useInteractiveLinesStore();

	const { setScrollAllowed } = useScrollStore();
	const pathname = usePathname();
	const prevPath = useRef<string | null>(null);

	const animationFrameRef = useRef<number | null>(null);
	const intervalRef = useRef<number | null>(null);

	const preloaderRef = useRef<HTMLDivElement | null>(null);
	const imageRef = useRef<HTMLDivElement | null>(null);

	const currentProgress = useRef(1);
	const targetProgress = useRef(9);
	const lastUpdateTime = useRef(performance.now());

	// Функция для запуска интервала увеличения targetProgress
	const startProgressInterval = useCallback(() => {
		// Очищаем предыдущий интервал, если он существует
		if (intervalRef.current !== null) {
			clearInterval(intervalRef.current);
		}

		// Создаем новый интервал
		intervalRef.current = window.setInterval(() => {
			// Увеличиваем targetProgress на 9, но не более 100
			targetProgress.current = Math.min(targetProgress.current + 9, 100);

			// Если достигли 100, очищаем интервал
			if (targetProgress.current >= 100) {
				if (intervalRef.current !== null) {
					clearInterval(intervalRef.current);
					intervalRef.current = null;
				}
			}
		}, 1000); // 1000 мс = 1 секунда
	}, []);

	// Функция, которая выполняется ПЕРЕД переходом по ссылке
	const beforeNavigation = useCallback(async () => {
		// Останавливаем текущую анимацию прогресса
		if (animationFrameRef.current !== null) {
			cancelAnimationFrame(animationFrameRef.current);
			animationFrameRef.current = null;
		}

		// Останавливаем интервал, если он существует
		if (intervalRef.current !== null) {
			clearInterval(intervalRef.current);
			intervalRef.current = null;
		}

		console.log("1");
		// Сбрасываем состояние прелоадера
		setPageState("loading");
		lastUpdateTime.current = performance.now();
		currentProgress.current = 1;
		targetProgress.current = 9;
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

					// Запускаем интервал увеличения targetProgress
					startProgressInterval();

					setTimeout(() => {
						resolve();
					}, totalDelay);
				});
			});
		});
	}, [startProgressInterval, pageState]);

	// Функция, которая выполняется ПОСЛЕ перехода по ссылке
	const afterProgress100 = useCallback(() => {
		setPageState("ready");
		setScrollAllowed(true);

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

		// Запускаем интервал увеличения targetProgress
		startProgressInterval();

		// Очищаем интервал при размонтировании компонента
		return () => {
			if (intervalRef.current !== null) {
				clearInterval(intervalRef.current);
				intervalRef.current = null;
			}
		};
	}, [beforeNavigation, startProgressInterval]);

	useEffect(() => {
		// console.log(pageState, progress);
		if (prevPath.current !== null && prevPath.current !== pathname) {
			// setPageState("loading");
		}
		prevPath.current = pathname;
	}, [pathname]);

	useEffect(() => {
		if (progress >= 100) {
			afterProgress100();
		}
	}, [progress]);

	useEffect(() => {
		// console.log(pageState, progress);
		if (pageState === "ready" && progress >= 100) {
		}
	}, [pageState, progress, pathname]);

	useEffect(() => {
		if (pageState === "ready") {
			targetProgress.current = 100;
		}
	}, [pageState]);

	return (
		<div
			ref={preloaderRef}
			className={`preloader ${styles.preloader} ${pageState === "ready" && progress >= 100 && styles.hidden} ${pageState != "default" && progress < 100 && styles.loading} ${
				isProjectLoading ? styles.loadingProject : ""
			}`}
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
				<img
					src={projectImage ? projectImage : "/images/projects/placeholder_big.png"}
					alt="project"
					style={{
						width: imageRect?.innerImageWidth,
						height: imageRect?.innerImageHeight,
						transition: pageState === "ready" && progress >= 100 ? "all 0.55s 0s" : imageRect?.transition,
					}}
				/>
				<div className={styles.overlay} />
			</div>
		</div>
	);
}
