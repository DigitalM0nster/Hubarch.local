import { useInteractiveLinesStore } from "@/store/interactiveLinesStore";
import { useHudMenuStore } from "@/store/hudMenuStore";
import { useEffect, useState, useRef, useLayoutEffect } from "react";
import { useScrollStore } from "@/store/scrollStore";
import { useWindowStore } from "@/store/windowStore";
import { usePathname } from "next/navigation";

export const useScreenScroll = (moduleStyles?: Record<string, string>) => {
	const { miniLine, horizontalLine, verticalLine, setNewIndex, setActiveLinesHud, setLinesColor } = useInteractiveLinesStore();
	const { activeMenu, setScreenLightness } = useHudMenuStore();
	const { scrollAllowed, setScrollAllowed } = useScrollStore();
	const { isMobile } = useWindowStore();
	const pathname = usePathname();

	const [activeScreenIndex, setActiveScreenIndex] = useState(0);
	const screensRef = useRef<NodeListOf<Element> | null>(null);

	const scrollAllowedRef = useRef(scrollAllowed);
	const scrollAllowedLocalRef = useRef(true);
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
		const positionY = parseFloat(screen.dataset.positionY || "50");
		const verticalLineHeight = parseFloat(screen.dataset.verticalHeight || "100");
		const horizontalLineWidth = parseFloat(screen.dataset.horizontalWidth || "100");
		const horizontalLineX = parseFloat(screen.dataset.horizontalX || "100");
		const linesColor = (screen.dataset.linesColor === "light" ? "light" : "dark") as "light" | "dark";

		setScreenLightness(screenLightness === "light" ? "light" : "dark");
		setNewIndex(linesIndex);
		miniLine.setNewRotation(miniLineRotation);
		verticalLine.setHeight(verticalLineHeight);
		verticalLine.setNewX(positionX);
		horizontalLine.setNewY(positionY);
		horizontalLine.setNewX(horizontalLineX);
		horizontalLine.setWidth(horizontalLineWidth);
		setLinesColor(linesColor);
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
			if (!scrollAllowedLocalRef.current) return;
			if (isMobile || !screensRef.current?.length) return;
			if (!scrollAllowedRef.current || activeMenuRef.current) return;

			if (event instanceof WheelEvent) {
				const elUnderMouse = document.elementFromPoint(event.clientX, event.clientY);
				const scrollZone = elUnderMouse?.closest(".noScreenScrollZone") as HTMLElement | null;

				if (scrollZone) {
					const scrollables = Array.from(document.querySelectorAll<HTMLElement>(".scrollable"));

					let nearestScrollable: HTMLElement | null = null;
					let nearestDistance = Infinity;

					for (const scrollable of scrollables) {
						const rect = scrollable.getBoundingClientRect();
						const centerX = rect.left + rect.width / 2;
						const centerY = rect.top + rect.height / 2;

						const dx = event.clientX - centerX;
						const dy = event.clientY - centerY;
						const distance = Math.sqrt(dx * dx + dy * dy);

						if (distance < nearestDistance) {
							nearestDistance = distance;
							nearestScrollable = scrollable;
						}
					}

					if (nearestScrollable) {
						const { scrollTop, scrollHeight, clientHeight } = nearestScrollable;

						const isAtTop = scrollTop === 0;
						const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;

						if ((event.deltaY < 0 && !isAtTop) || (event.deltaY > 0 && !isAtBottom)) {
							nearestScrollable.scrollTop += event.deltaY;
							event.preventDefault();
							return; // блокируем переход экрана
						}
					}
				}
			}

			let newIndex = activeScreenIndex;

			if (event instanceof WheelEvent) {
				newIndex += event.deltaY > 0 ? 1 : -1;
			} else if (event instanceof KeyboardEvent) {
				if (["ArrowDown", "PageDown"].includes(event.key)) newIndex++;
				if (["ArrowUp", "PageUp"].includes(event.key)) newIndex--;
			}

			newIndex = Math.max(0, Math.min(newIndex, screensRef.current.length - 1));

			if (newIndex !== activeScreenIndex) {
				scrollAllowedLocalRef.current = false;
				setScrollAllowed(false);
				setActiveScreenIndex(newIndex);

				const screen = screensRef.current[newIndex] as HTMLElement;
				changeScreenOptions(screen);

				setTimeout(() => {
					scrollAllowedLocalRef.current = true;
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
