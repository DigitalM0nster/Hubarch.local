import { useEffect, useLayoutEffect, useRef } from "react";
import { useInteractiveLinesStore } from "@/store/interactiveLinesStore";
import { useHudMenuStore } from "@/store/hudMenuStore";
import { usePathname } from "next/navigation";
import { useWindowStore } from "@/store/windowStore";

export const useScreenInit = () => {
	const { setActiveLinesHud, setLinesColor, setLinesOpacity, setNewIndex, miniLine, verticalLine, horizontalLine, leftLine, rightLine, setIsScreenScrolling, isScreenScrolling } =
		useInteractiveLinesStore();
	const { screenLightness, setScreenLightness, isTopBannerActive } = useHudMenuStore();
	const { windowWidth, readyCheck } = useWindowStore();

	const pathname = usePathname();
	const screensRef = useRef<NodeListOf<Element> | null>(null);
	const simpleScrollRef = useRef<boolean>(false);
	const rafScrollCheckPendingRef = useRef<boolean>(false);

	const changeScreenOptions = (screen: HTMLElement) => {
		console.log(screen);
		const screenLightness = screen.dataset.screenLightness || "light";
		const linesIndex = parseInt(screen.dataset.linesIndex || "0", 10);
		const miniLineRotation = parseFloat(screen.dataset.miniLineRotation || "0");
		const positionX = parseFloat(screen.dataset.positionX || "50");
		const positionY = parseFloat(screen.dataset.positionY || "50");
		const verticalLineHeight = parseFloat(screen.dataset.verticalHeight || "100");
		const horizontalLineWidth = parseFloat(screen.dataset.horizontalWidth || "100");
		const verticalLineY = parseFloat(screen.dataset.verticalY || "50");
		const horizontalLineX = parseFloat(screen.dataset.horizontalX || "100");
		const leftLineX = parseFloat(screen.dataset.leftLineX || "0");
		const leftLineHeight = parseFloat(screen.dataset.leftLineHeight || "0");
		const rightLineX = parseFloat(screen.dataset.rightLineX || "100");
		const rightLineHeight = parseFloat(screen.dataset.rightLineHeight || "0");
		const linesColor = (screen.dataset.linesColor === "light" ? "light" : "dark") as "light" | "dark";
		const linesOpacity = parseFloat(screen.dataset.linesOpacity || "1.0");

		setScreenLightness(screenLightness === "light" ? "light" : "dark");

		setNewIndex(linesIndex);

		miniLine.setNewRotation(miniLineRotation);

		verticalLine.setHeight(verticalLineHeight);
		verticalLine.setNewX(positionX);
		verticalLine.setNewY(verticalLineY);

		horizontalLine.setNewY(positionY);
		horizontalLine.setNewX(horizontalLineX);
		horizontalLine.setWidth(horizontalLineWidth);

		console.log(leftLineHeight);
		leftLine.setHeight(leftLineHeight);
		leftLine.setNewX(leftLineX);
		rightLine.setHeight(rightLineHeight);
		rightLine.setNewX(rightLineX);

		setLinesColor(linesColor);
		setLinesOpacity(linesOpacity);
	};

	// Функция для обновления классов screenContent в зависимости от isTopBannerActive
	const updateScreenContentClasses = () => {
		const screenScroll = document.querySelector(".screenScroll");
		if (screenScroll?.classList.contains("fullScroll")) {
			const screenContents = document.querySelectorAll(".screenContent");
			if (screenContents.length > 0) {
				screenContents.forEach((content) => {
					if (isTopBannerActive) {
						content.classList.add("withTopBanner");
					} else {
						content.classList.remove("withTopBanner");
					}
				});
			}
		} else {
			// const screenContent = document.querySelectorAll(".screenScroll .screenContent");
			// console.log(screenContent);
			// if (screenContent.length > 0) {
			// 	if (isTopBannerActive) {
			// 		screenContent[0].classList.add("withTopBanner");
			// 	} else {
			// 		screenContent[0].classList.remove("withTopBanner");
			// 	}
			// }
		}
	};

	const waitForScreensReady = (): Promise<NodeListOf<Element>> => {
		return new Promise((resolve) => {
			const tryFind = () => {
				const screens = document.querySelectorAll(".screen");
				const screenContents = document.querySelectorAll(".screenContent");
				if (screens.length > 0 && screenContents.length > 0) {
					requestAnimationFrame(() => resolve(screens));
				} else {
					requestAnimationFrame(tryFind);
				}
			};
			requestAnimationFrame(tryFind);
		});
	};

	// Функция для определения наличия вертикального скролла у контейнера .screenScroll (с троттлингом через RAF)
	const updateIsScreenScrolling = () => {
		if (rafScrollCheckPendingRef.current) return;
		rafScrollCheckPendingRef.current = true;
		requestAnimationFrame(() => {
			rafScrollCheckPendingRef.current = false;
			const scrollContainer = document.querySelector(".screenScroll") as HTMLElement | null;
			if (!scrollContainer) {
				if (isScreenScrolling !== false) setIsScreenScrolling(false);
				return;
			}
			// Если видимая высота меньше полной прокручиваемой высоты, значит есть вертикальный скролл
			const hasVerticalScroll = scrollContainer.clientHeight < scrollContainer.scrollHeight;
			if (hasVerticalScroll !== isScreenScrolling) {
				setIsScreenScrolling(hasVerticalScroll);
			}
		});
	};

	useLayoutEffect(() => {
		let mObserver: MutationObserver | null = null;
		let ro: ResizeObserver | null = null;
		let destroyed = false;

		screensRef.current = null;
		simpleScrollRef.current = false;

		waitForScreensReady().then((screens) => {
			if (destroyed) return;
			screensRef.current = screens;

			const firstScreen = screens[0] as HTMLElement;
			if (firstScreen) {
				setActiveLinesHud(true);
				changeScreenOptions(firstScreen);
			}

			// Обновляем классы screenContent при первой загрузке
			updateScreenContentClasses();

			// Проверяем наличие вертикального скролла у контейнера .screenScroll
			updateIsScreenScrolling();

			mObserver = new MutationObserver(() => {
				const updated = document.querySelectorAll(".screen");
				screensRef.current = updated;

				// Определяем тип скролла
				if (updated[0].parentElement?.classList.contains("simpleScroll")) {
					simpleScrollRef.current = true;
				}

				// На изменения в пределах контейнера безопасно проверяем наличие вертикального скролла
				updateIsScreenScrolling();
			});

			const scrollContainer = document.querySelector(".screenScroll") as HTMLElement | null;
			if (scrollContainer) {
				mObserver.observe(scrollContainer, { childList: true, subtree: true });
				ro = new ResizeObserver(() => {
					updateIsScreenScrolling();
				});
				ro.observe(scrollContainer);
			} else {
				// Фолбэк: если контейнер не найден, наблюдаем за телом без глубокой подписки
				mObserver.observe(document.body, { childList: true, subtree: false });
			}
		});

		// Проверяем наличие активного экрана
		const checkActiveScreen = () => {
			const screens = document.querySelectorAll(".screen");
			if (screens && screens.length > 0) {
				for (let i = 0; i < screens.length; i++) {
					const screen = screens[i] as HTMLElement;
					if (screen.classList.contains("active")) {
						changeScreenOptions(screen);
						break;
					}
				}
			}
		};

		// Вызываем проверку сразу
		checkActiveScreen();

		return () => {
			destroyed = true;
			mObserver?.disconnect();
			ro?.disconnect();
			// При размонтировании сбрасываем флаг скролла
			setIsScreenScrolling(false);
		};
	}, [pathname, windowWidth, readyCheck]);

	// Эффект для обновления классов screenContent при изменении isTopBannerActive
	useEffect(() => {
		updateScreenContentClasses();
		// Изменение верхнего баннера может влиять на высоту контейнера
		updateIsScreenScrolling();
	}, [isTopBannerActive]);

	return { changeScreenOptions, screensRef, simpleScrollRef };
};
