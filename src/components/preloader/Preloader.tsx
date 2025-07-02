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

	const preloaderRef = useRef<HTMLDivElement | null>(null);

	const currentProgress = useRef(1);
	const targetProgress = useRef(9);
	const lastUpdateTime = useRef(performance.now());

	// Эффект для увеличения targetProgress на 9 каждую секунду
	useEffect(() => {
		// Создаем интервал, который будет выполняться каждую секунду
		const intervalId = setInterval(() => {
			// Увеличиваем targetProgress на 9, но не более 100
			targetProgress.current = Math.min(targetProgress.current + 9, 100);

			// Если достигли 100, очищаем интервал
			if (targetProgress.current >= 100) {
				clearInterval(intervalId);
			}
		}, 1000); // 1000 мс = 1 секунда

		// Очистка интервала при размонтировании компонента
		return () => {
			clearInterval(intervalId);
		};
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

	useLayoutEffect(() => {
		animateProgress();
	}, []);

	useEffect(() => {
		setResetPreloaderCallback(async () => {
			if (animationFrameRef.current !== null) {
				cancelAnimationFrame(animationFrameRef.current);
				animationFrameRef.current = null;
			}

			targetProgress.current = 0;
			currentProgress.current = 0;
			lastUpdateTime.current = performance.now();

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
		if (progress >= 100) {
			setPageState("ready");
			setTimeout(() => {
				setScrollAllowed(true);
			}, 750);
		}
	}, [progress]);

	useEffect(() => {
		if (pageState === "ready") {
			targetProgress.current = 100;
		}
	}, [pageState]);

	return (
		<div ref={preloaderRef} className={`preloader ${styles.preloader} ${progress >= 100 && pageState === "ready" && styles.hidden}`}>
			<div className="screenContent">
				<div className={styles.progressBar}>
					<div className={styles.progressLine}>
						<div className={styles.currentLine} style={{ width: `${progress}%` }} />
						<div className={styles.progress}>{progress}%</div>
					</div>
				</div>
			</div>
		</div>
	);
}
