import { useEffect, useState, useRef, useLayoutEffect } from "react";
import { useScrollStore } from "@/store/scrollStore";
import { useWindowStore } from "@/store/windowStore";
import { useHudMenuStore } from "@/store/hudMenuStore";
import { usePathname } from "next/navigation";
import { useScreenInit } from "@/hooks/useScreenInit";

export const useScreenScroll = (moduleStyles?: Record<string, string>) => {
	const { scrollAllowed, setScrollAllowed } = useScrollStore();
	const { isMobile } = useWindowStore();
	const { activeMenu } = useHudMenuStore();
	const pathname = usePathname();

	const [activeScreenIndex, setActiveScreenIndex] = useState(0);

	const scrollAllowedRef = useRef(scrollAllowed);
	const scrollAllowedLocalRef = useRef(true);
	const activeMenuRef = useRef(activeMenu);

	const { changeScreenOptions, screensRef } = useScreenInit();

	useEffect(() => {
		scrollAllowedRef.current = scrollAllowed;
	}, [scrollAllowed]);

	useEffect(() => {
		activeMenuRef.current = activeMenu;
	}, [activeMenu]);

	const updateActiveClasses = () => {
		console.log("gg");
		if (!screensRef.current) return;
		console.log("gg1");

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

	useLayoutEffect(() => {
		screensRef.current = document.querySelectorAll(".screen");
	}, [pathname]);

	useLayoutEffect(() => {
		const handleScroll = (event: WheelEvent | KeyboardEvent) => {
			console.log(!scrollAllowedLocalRef.current, isMobile, !screensRef.current?.length, !scrollAllowedRef.current, activeMenuRef.current);
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
							return;
						}
					}
				}
			}

			let newIndex = activeScreenIndex;

			if (event instanceof WheelEvent) {
				console.log("1");
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

		screensRef.current = document.querySelectorAll(".screen");

		observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						const index = Array.from(screensRef.current!).findIndex((el) => el === entry.target);
						if (index !== -1) {
							setActiveScreenIndex(index);
							changeScreenOptions(entry.target as HTMLElement);
						}
					}
				}
			},
			{ threshold: 0.5 }
		);

		screensRef.current.forEach((screen) => observer.observe(screen));

		return () => {
			observer?.disconnect();
		};
	}, [isMobile]);

	useLayoutEffect(() => {
		updateActiveClasses();
	}, [activeScreenIndex]);

	return { activeScreenIndex };
};
