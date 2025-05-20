"use client";

import { useDetectMobile } from "@/hooks/useDetectMobile";
import { useScreenInit } from "@/hooks/useScreenInit";
import { useScreenScroll } from "@/hooks/useScreenScroll";
import { usePreloaderStore } from "@/store/preloaderStore";
import { useScrollStore } from "@/store/scrollStore";
import { useWindowStore } from "@/store/windowStore";
import { useEffect } from "react";
import styles from "./styles.module.scss";
import stylesForProjects from "@/components/pages/mainPage/styles.module.scss";

export default function ClientComponent() {
	useScreenScroll(stylesForProjects);
	useScreenInit();
	useDetectMobile();
	const { setTotal, markReady } = usePreloaderStore();
	const { scrollAllowed } = useScrollStore();
	const { windowWidth } = useWindowStore();

	useEffect(() => {
		setTotal(0);
		markReady();
	}, []);

	const updateOneOverlay = (description: HTMLElement, scrollOverlay: HTMLElement) => {
		const { scrollTop, scrollHeight, clientHeight } = description;
		const scrollBottom = scrollTop + clientHeight;

		let opacity = 1;
		if (scrollTop <= 5) {
			opacity = 1;
		} else if (scrollBottom >= scrollHeight - 5) {
			opacity = 0;
		} else {
			opacity = 0.5;
		}

		scrollOverlay.style.opacity = String(opacity);
	};

	const handleResizeAndCheckScroll = () => {
		// Очищаем предыдущие слушатели
		const allDescriptions = Array.from(document.querySelectorAll(`.${styles.description}`)) as HTMLElement[];

		allDescriptions.forEach((description) => {
			const parent = description.closest(`.${styles.textBlock}`);
			if (!parent) return;

			const scrollOverlay = parent.querySelector(`.${styles.scrollOverlay}`) as HTMLElement | null;
			if (!scrollOverlay) return;

			description.removeEventListener("scroll", () => {}); // старые слушатели — заглушка (если захочешь улучшить — надо хранить ссылки)

			if (description.scrollHeight > description.clientHeight) {
				scrollOverlay.classList.add(styles.active);
				updateOneOverlay(description, scrollOverlay);

				// 👇 Навешиваем обработчик
				description.addEventListener("scroll", () => {
					updateOneOverlay(description, scrollOverlay);
				});
			} else {
				scrollOverlay.classList.remove(styles.active);
				scrollOverlay.style.opacity = "0";
			}
		});
	};

	useEffect(() => {
		const screenScroll = document.querySelector(".screenScroll");
		if (scrollAllowed) {
			screenScroll?.classList.remove("noScroll");
		} else {
			screenScroll?.classList.add("noScroll");
		}

		handleResizeAndCheckScroll();
	}, [scrollAllowed]);

	useEffect(() => {
		handleResizeAndCheckScroll();

		window.addEventListener("resize", handleResizeAndCheckScroll);
		return () => window.removeEventListener("resize", handleResizeAndCheckScroll);
	}, [windowWidth]);

	return null;
}
