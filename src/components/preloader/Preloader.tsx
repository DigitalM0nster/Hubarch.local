// src\components\preloader\Preloader.tsx
"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { usePreloaderStore } from "@/store/preloaderStore";
import styles from "./styles.module.scss";
import { useScrollStore } from "@/store/scrollStore";

export default function Preloader() {
	const { setResetPreloaderCallback, triggerResetPreloader, progress, setProgress, pageState, setPageState } = usePreloaderStore();

	const { setScrollAllowed } = useScrollStore();
	const pathname = usePathname();
	const prevPath = useRef<string | null>(null);

	const animationFrameRef = useRef<number | null>(null);
	const intervalRef = useRef<number | null>(null);

	const preloaderRef = useRef<HTMLDivElement | null>(null);

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

					// resolve();
					setTimeout(() => {
						resolve();
					}, totalDelay);
				});
			});
		});
	}, [startProgressInterval]);

	// Функция, которая выполняется ПОСЛЕ перехода по ссылке
	const afterNavigation = useCallback(() => {
		// Ничего не делаем, так как анимация уже запущена в beforeNavigation
	}, []);

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
		if (prevPath.current !== null && prevPath.current !== pathname) {
			// afterNavigation происходит здесь
		}
		prevPath.current = pathname;
	}, [pathname]);

	useEffect(() => {
		if (progress >= 100) {
			setTimeout(() => {
				setPageState("ready");
				setScrollAllowed(true);
			}, 0);
		} else {
			setPageState("loading");
			setScrollAllowed(false);
		}
	}, [progress]);

	useEffect(() => {
		if (pageState === "ready") {
			targetProgress.current = 100;
		}
	}, [pageState]);

	return (
		<div ref={preloaderRef} className={`preloader ${styles.preloader} ${pageState === "ready" && styles.hidden} ${pageState === "loading" && styles.loading}`}>
			<div className={styles.background} />
			<div className="screenContent">
				<div className={styles.progressBar}>
					<div className={styles.progressLine}>
						<div className={styles.currentLine} style={{ width: `${progress}%` }} />
					</div>
					<div className={styles.progress}>{progress}%</div>
				</div>
			</div>
		</div>
	);
}
