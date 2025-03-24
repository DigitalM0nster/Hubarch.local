import { useInteractiveLinesStore } from "@/store/interactiveLinesStore";
import { useHudMenuStore } from "@/store/hudMenuStore";
import { useEffect, useState, useRef, useLayoutEffect } from "react";
import { useScrollStore } from "@/store/scrollStore";
import { useWindowStore } from "@/store/windowStore";
import { usePathname } from "next/navigation";

export const useScreenScroll = (moduleStyles?: Record<string, string>) => {
	const { miniLine, verticalLine, setNewIndex, setActiveLinesHud } = useInteractiveLinesStore();
	const { activeMenu, setScreenLightness } = useHudMenuStore();
	const { scrollAllowed, setScrollAllowed } = useScrollStore();
	const pathname = usePathname(); // Получаем текущий путь
	const { isMobile } = useWindowStore();

	const [activeScreenIndex, setActiveScreenIndex] = useState(0);
	const screensRef = useRef<NodeListOf<Element> | null>(null);

	// 🟡 Установка параметров экрана
	const changeScreenOptions = (screen: HTMLElement) => {
		const screenLightness = screen.dataset.screenLightness || "light";
		const linesIndex = parseInt(screen.dataset.linesIndex || "0", 10);
		const miniLineRotation = parseFloat(screen.dataset.miniLineRotation || "0");
		const positionX = parseFloat(screen.dataset.positionX || "50");
		const positionY = parseFloat(screen.dataset.positionY || "50");

		screenLightness === "light" ? setScreenLightness("light") : setScreenLightness("dark");
		setNewIndex(linesIndex);
		miniLine.setNewRotation(miniLineRotation);
		verticalLine.setNewX(positionX);
	};

	// 📦 Собираем список экранов
	const updateScreensList = () => {
		const screens = document.querySelectorAll(".screen");
		screensRef.current = screens;
		console.log(screens);
	};

	// 🎯 Применение классов активности к экранам
	const updateActiveClasses = () => {
		if (!screensRef.current) {
			return;
		}

		screensRef.current.forEach((screen, index) => {
			const isPrev = index < activeScreenIndex;
			const isActive = index === activeScreenIndex;

			screen.classList.toggle("prev", isPrev);
			screen.classList.toggle("active", isActive);

			if (moduleStyles) {
				screen.classList.toggle(moduleStyles.prev, isPrev);
				screen.classList.toggle(moduleStyles.active, isActive);

				if (!isPrev && !isActive) {
					screen.classList.remove(moduleStyles.prev, moduleStyles.active);
				}
			}
		});
	};

	function waitForScreensReady(): Promise<HTMLElement[]> {
		return new Promise((resolve) => {
			const tryFind = () => {
				const screens = document.querySelectorAll<HTMLElement>(".screen");

				if (screens.length > 0) {
					// ждём ещё один кадр, чтобы DOM точно был готов
					console.log("gg1");
					requestAnimationFrame(() => {
						resolve(Array.from(screens));
					});
				} else {
					// пробуем снова на следующем кадре
					console.log("gg2");
					requestAnimationFrame(tryFind);
				}
			};

			// начнем цикл
			console.log("gg3");
			requestAnimationFrame(tryFind);
		});
	}

	// 📡 Наблюдаем за DOM — если появляются .screen, обновляем
	useLayoutEffect(() => {
		let mObserver: MutationObserver | null = null;

		// сбрасываем старые элементы
		screensRef.current = null;
		updateScreensList();

		waitForScreensReady().then((screens) => {
			// обновляем ссылки
			screensRef.current = screens as unknown as NodeListOf<Element>;

			const firstScreen = screens[0];
			if (firstScreen) {
				setActiveLinesHud(true);
				changeScreenOptions(firstScreen);
			}

			updateActiveClasses(); // заново применить классы

			// следим за появлением новых .screen
			mObserver = new MutationObserver(() => {
				updateScreensList();
			});
			mObserver.observe(document.body, { childList: true, subtree: true });
		});

		return () => {
			if (mObserver) mObserver.disconnect();
		};
	}, [pathname]);

	// 🖱 Скролл навигация
	useLayoutEffect(() => {
		const handleScroll = (event: WheelEvent | KeyboardEvent) => {
			if (isMobile || !scrollAllowed || activeMenu || !screensRef.current?.length) return;

			let newIndex = activeScreenIndex;

			if (event instanceof WheelEvent) {
				newIndex += event.deltaY > 0 ? 1 : -1;
			}

			if (event instanceof KeyboardEvent) {
				if (["ArrowDown", "PageDown"].includes(event.key)) newIndex++;
				if (["ArrowUp", "PageUp"].includes(event.key)) newIndex--;
			}

			newIndex = Math.max(0, Math.min(newIndex, screensRef.current.length - 1));

			if (newIndex !== activeScreenIndex) {
				setScrollAllowed(false);
				setActiveScreenIndex(newIndex);

				const screen = screensRef.current[newIndex] as HTMLElement;
				console.log(screensRef.current);
				changeScreenOptions(screen);

				setTimeout(() => setScrollAllowed(true), 800);
			}
		};
		window.addEventListener("wheel", handleScroll);
		window.addEventListener("keydown", handleScroll);

		return () => {
			window.removeEventListener("wheel", handleScroll);
			window.removeEventListener("keydown", handleScroll);
		};
	}, [activeMenu, scrollAllowed, isMobile]);

	// 📱 Мобильная логика: наблюдение за видимостью экранов
	useLayoutEffect(() => {
		if (!isMobile) return;

		let observer: IntersectionObserver;

		waitForScreensReady().then((screens) => {
			screensRef.current = screens as unknown as NodeListOf<Element>;

			observer = new IntersectionObserver(
				(entries) => {
					for (const entry of entries) {
						if (entry.isIntersecting) {
							const index = screens.findIndex((el) => el === entry.target);
							if (index !== -1) {
								setActiveScreenIndex(index);
								changeScreenOptions(entry.target as HTMLElement);
							}
						}
					}
				},
				{ threshold: 0.5 }
			);
			screens.forEach((screen) => {
				// console.log(screen);
				observer.observe(screen);
			});
		});

		return () => {
			observer?.disconnect();
		};
	}, [isMobile]);

	useLayoutEffect(() => {
		updateActiveClasses();
	}, [activeScreenIndex]);

	return { activeScreenIndex };
};
