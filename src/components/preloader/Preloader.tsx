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
		cachedImages,
	} = usePreloaderStore();

	const { verticalLine, horizontalLine, linesOpacity } = useInteractiveLinesStore();

	const { setScrollAllowed } = useScrollStore();
	const pathname = usePathname();
	const prevPath = useRef<string | null>(null);

	const animationFrameRef = useRef<number | null>(null);
	const intervalRef = useRef<number | null>(null);
	const styleIntervalRef = useRef<number | null>(null);

	const preloaderRef = useRef<HTMLDivElement | null>(null);
	const imageRef = useRef<HTMLDivElement | null>(null);

	const currentProgress = useRef(1);
	const targetProgress = useRef(9);
	const lastUpdateTime = useRef(performance.now());

	// Состояние для типа прелоадера
	const [preloaderStyle, setPreloaderStyle] = useState<string>("type1");

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

					// Запускаем интервал изменения стиля
					startStyleChangeInterval();

					setTimeout(() => {
						resolve();
					}, totalDelay);
				});
			});
		});
	}, [startProgressInterval, startStyleChangeInterval, pageState]);

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

		// Запускаем интервал изменения стиля
		startStyleChangeInterval();

		// Очищаем интервалы при размонтировании компонента
		return () => {
			if (intervalRef.current !== null) {
				clearInterval(intervalRef.current);
				intervalRef.current = null;
			}

			if (styleIntervalRef.current !== null) {
				clearInterval(styleIntervalRef.current);
				styleIntervalRef.current = null;
			}
		};
	}, [beforeNavigation, startProgressInterval, startStyleChangeInterval]);

	// // Блокировка навигации назад/вперед
	// useEffect(() => {
	// 	// Сохраняем текущий URL при первой загрузке
	// 	if (prevPath.current === null) {
	// 		prevPath.current = pathname;
	// 		// Заменяем текущую запись в истории браузера
	// 		window.history.replaceState({ path: pathname, blockNav: true }, "", pathname);
	// 	}

	// 	// Переменная для отслеживания, был ли переход инициирован кнопкой назад/вперед
	// 	let isBackForwardNav = false;

	// 	// Функция для блокировки навигации назад/вперед
	// 	const handlePopState = (e: PopStateEvent) => {
	// 		// Проверяем, был ли это переход по кнопке назад/вперед
	// 		// Если в state нет нашего флага blockNav, значит это обычный переход по ссылке
	// 		if (!e.state || e.state.blockNav !== true) {
	// 			// Это обычный переход по ссылке, не блокируем
	// 			return;
	// 		}

	// 		// Получаем URL, куда пытается перейти пользователь
	// 		const targetUrl = document.location.href;

	// 		// Выводим в консоль ссылку, куда должен был произойти переход
	// 		console.log("Попытка перехода назад/вперед на:", targetUrl);
	// 		console.log("Навигация назад/вперед заблокирована");

	// 		// Устанавливаем флаг, что это навигация назад/вперед
	// 		isBackForwardNav = true;

	// 		// Предотвращаем навигацию, возвращая пользователя на текущую страницу
	// 		window.history.pushState({ path: pathname, blockNav: true }, "", pathname);
	// 	};

	// 	// Блокировка клавиш навигации (Alt+Left, Backspace и др.)
	// 	const handleKeyDown = (e: KeyboardEvent) => {
	// 		// Блокируем Alt+Left (назад) и Alt+Right (вперед)
	// 		if (e.altKey && (e.key === "ArrowLeft" || e.key === "ArrowRight")) {
	// 			e.preventDefault();
	// 			console.log("Навигация с помощью клавиш заблокирована");
	// 			return false;
	// 		}

	// 		// Блокируем Backspace, если не в поле ввода
	// 		if (
	// 			e.key === "Backspace" &&
	// 			!["INPUT", "TEXTAREA"].includes((e.target as HTMLElement).tagName) &&
	// 			!((e.target as HTMLElement).getAttribute("contenteditable") === "true")
	// 		) {
	// 			e.preventDefault();
	// 			console.log("Навигация с помощью Backspace заблокирована");
	// 			return false;
	// 		}
	// 	};

	// 	// Перехватываем все переходы по ссылкам, чтобы добавить наш флаг
	// 	const handleClick = (e: MouseEvent) => {
	// 		// Проверяем, является ли цель клика ссылкой
	// 		const target = e.target as HTMLElement;
	// 		const anchor = target.closest("a");

	// 		if (anchor && anchor.href && !anchor.getAttribute("target")) {
	// 			// Не блокируем переход, но добавляем наш флаг в историю
	// 			// Это позволит отличить обычные переходы от навигации назад/вперед
	// 			window.history.pushState({ path: anchor.href, blockNav: true }, "", anchor.href);
	// 		}
	// 	};

	// 	// Добавляем обработчики событий
	// 	window.addEventListener("popstate", handlePopState);
	// 	window.addEventListener("keydown", handleKeyDown);
	// 	document.addEventListener("click", handleClick);

	// 	// Удаляем обработчики при размонтировании компонента
	// 	return () => {
	// 		window.removeEventListener("popstate", handlePopState);
	// 		window.removeEventListener("keydown", handleKeyDown);
	// 		document.removeEventListener("click", handleClick);
	// 		// Удаляем интервал, так как он больше не нужен
	// 	};
	// }, [pathname]);

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

	return (
		<div
			ref={preloaderRef}
			className={`preloader ${styles.preloader} ${pageState === "ready" && progress >= 100 && styles.hidden} ${pageState != "default" && progress < 100 && styles.loading} ${
				isProjectLoading ? styles.loadingProject : ""
			} ${styles[preloaderStyle]} ${projectImage ? styles.disabled : ""}`}
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
					<div className={styles.image}>
						<img src="/images/preloader/1.png" alt="hubarch preloader image1" />
					</div>
					<div className={styles.image}>
						<img src="/images/preloader/2.png" alt="hubarch preloader image2" />
					</div>
					<div className={styles.image}>
						<img src="/images/preloader/3.png" alt="hubarch preloader image3" />
					</div>
					<div className={styles.image}>
						<img src="/images/preloader/4.png" alt="hubarch preloader image4" />
					</div>
					<div className={styles.image}>
						<img src="/images/preloader/5.png" alt="hubarch preloader image4" />
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
