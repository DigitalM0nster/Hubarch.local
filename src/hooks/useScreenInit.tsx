import { useEffect, useLayoutEffect, useRef } from "react";
import { useInteractiveLinesStore } from "@/store/interactiveLinesStore";
import { useHudMenuStore } from "@/store/hudMenuStore";
import { usePathname } from "next/navigation";
import { useWindowStore } from "@/store/windowStore";

export const useScreenInit = () => {
	const { setActiveLinesHud, setLinesColor, setLinesOpacity, setNewIndex, miniLine, verticalLine, horizontalLine, leftLine, rightLine } = useInteractiveLinesStore();
	const { setScreenLightness } = useHudMenuStore();
	const { windowWidth } = useWindowStore();

	const pathname = usePathname();
	const screensRef = useRef<NodeListOf<Element> | null>(null);
	const simpleScrollRef = useRef<boolean>(false);

	const changeScreenOptions = (screen: HTMLElement) => {
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

		leftLine.setHeight(leftLineHeight);
		leftLine.setNewX(leftLineX);
		rightLine.setHeight(rightLineHeight);
		rightLine.setNewX(rightLineX);

		setLinesColor(linesColor);
		setLinesOpacity(linesOpacity);
	};

	const waitForScreensReady = (): Promise<NodeListOf<Element>> => {
		return new Promise((resolve) => {
			const tryFind = () => {
				const screens = document.querySelectorAll(".screen");
				if (screens.length > 0) {
					requestAnimationFrame(() => resolve(screens));
				} else {
					requestAnimationFrame(tryFind);
				}
			};
			requestAnimationFrame(tryFind);
		});
	};

	useLayoutEffect(() => {
		let mObserver: MutationObserver | null = null;
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

			mObserver = new MutationObserver(() => {
				const updated = document.querySelectorAll(".screen");
				screensRef.current = updated;

				// Определяем тип скролла
				if (updated[0].parentElement?.classList.contains("simpleScroll")) {
					simpleScrollRef.current = true;
				}
			});
			mObserver.observe(document.body, { childList: true, subtree: true });
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
		};
	}, [pathname, windowWidth]);

	return { changeScreenOptions, screensRef, simpleScrollRef };
};
