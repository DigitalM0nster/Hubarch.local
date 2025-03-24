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
	const { isMobile } = useWindowStore();
	const pathname = usePathname();

	const [activeScreenIndex, setActiveScreenIndex] = useState(0);
	const screensRef = useRef<NodeListOf<Element> | null>(null);

	const scrollAllowedRef = useRef(scrollAllowed);
	const activeMenuRef = useRef(activeMenu);

	/* eslint-disable react-hooks/exhaustive-deps */
	useEffect(() => {
		scrollAllowedRef.current = scrollAllowed;
	}, [scrollAllowed]);

	useEffect(() => {
		activeMenuRef.current = activeMenu;
	}, [activeMenu]);

	const changeScreenOptions = (screen: HTMLElement) => {
		const screenLightness = screen.dataset.screenLightness || "light";
		const linesIndex = parseInt(screen.dataset.linesIndex || "0", 10);
		const miniLineRotation = parseFloat(screen.dataset.miniLineRotation || "0");
		const positionX = parseFloat(screen.dataset.positionX || "50");

		setScreenLightness(screenLightness === "light" ? "light" : "dark");
		setNewIndex(linesIndex);
		miniLine.setNewRotation(miniLineRotation);
		verticalLine.setNewX(positionX);
	};

	const updateActiveClasses = () => {
		if (!screensRef.current) return;

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

		waitForScreensReady().then((screens) => {
			if (destroyed) return;
			screensRef.current = screens;

			const firstScreen = screens[0] as HTMLElement;
			if (firstScreen) {
				setActiveLinesHud(true);
				changeScreenOptions(firstScreen);
			}
			updateActiveClasses();

			mObserver = new MutationObserver(() => {
				const updated = document.querySelectorAll(".screen");
				screensRef.current = updated;
			});
			mObserver.observe(document.body, { childList: true, subtree: true });
		});

		return () => {
			destroyed = true;
			mObserver?.disconnect();
		};
	}, [pathname]);

	useLayoutEffect(() => {
		const handleScroll = (event: WheelEvent | KeyboardEvent) => {
			if (isMobile || !screensRef.current?.length) return;
			if (!scrollAllowedRef.current || activeMenuRef.current) return;

			let newIndex = activeScreenIndex;

			if (event instanceof WheelEvent) {
				newIndex += event.deltaY > 0 ? 1 : -1;
			} else if (event instanceof KeyboardEvent) {
				if (["ArrowDown", "PageDown"].includes(event.key)) newIndex++;
				if (["ArrowUp", "PageUp"].includes(event.key)) newIndex--;
			}

			newIndex = Math.max(0, Math.min(newIndex, screensRef.current.length - 1));

			if (newIndex !== activeScreenIndex) {
				setScrollAllowed(false);
				setActiveScreenIndex(newIndex);

				const screen = screensRef.current[newIndex] as HTMLElement;
				changeScreenOptions(screen);

				setTimeout(() => {
					setScrollAllowed(true);
				}, 800);
			}
		};

		window.addEventListener("wheel", handleScroll);
		window.addEventListener("keydown", handleScroll);
		return () => {
			window.removeEventListener("wheel", handleScroll);
			window.removeEventListener("keydown", handleScroll);
		};
	}, [activeScreenIndex, isMobile]);

	useLayoutEffect(() => {
		if (!isMobile) return;
		let observer: IntersectionObserver;

		waitForScreensReady().then((screens) => {
			screensRef.current = screens;

			observer = new IntersectionObserver(
				(entries) => {
					for (const entry of entries) {
						if (entry.isIntersecting) {
							const index = Array.from(screens).findIndex((el) => el === entry.target);
							if (index !== -1) {
								setActiveScreenIndex(index);
								changeScreenOptions(entry.target as HTMLElement);
							}
						}
					}
				},
				{ threshold: 0.5 }
			);

			screens.forEach((screen) => observer.observe(screen));
		});

		return () => {
			observer?.disconnect();
		};
	}, [isMobile]);

	useLayoutEffect(() => {
		updateActiveClasses();
	}, [activeScreenIndex]);

	/* eslint-enable react-hooks/exhaustive-deps */
	return { activeScreenIndex };
};
