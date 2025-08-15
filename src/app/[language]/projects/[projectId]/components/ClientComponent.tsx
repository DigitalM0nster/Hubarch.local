"use client";

import { useDetectMobile } from "@/hooks/useDetectMobile";
import { useScreenInit } from "@/hooks/useScreenInit";
import { useScreenScroll } from "@/hooks/useScreenScroll";
import { usePreloaderStore } from "@/store/preloaderStore";
import { useScrollStore } from "@/store/scrollStore";
import { useWindowStore } from "@/store/windowStore";
import { useEffect, useRef } from "react";
import styles from "./styles.module.scss";
import stylesForProjects from "@/components/pages/mainPage/styles.module.scss";
import { usePageReady } from "@/hooks/usePageReady";

export default function ClientComponent({ projectData }: { projectData: any }) {
	useScreenScroll(stylesForProjects);
	useScreenInit();
	useDetectMobile();
	const { setPageState } = usePreloaderStore();
	const { scrollAllowed, setScrollAllowed } = useScrollStore();
	const { windowWidth } = useWindowStore();

	// Создаем ref в клиентском компоненте
	const containerRef = useRef<HTMLDivElement | null>(null);

	// Находим контейнер по ID после монтирования компонента
	useEffect(() => {
		containerRef.current = document.getElementById("projectContainer") as HTMLDivElement;
	}, []);

	// Передаем массив зависимостей, которые должны быть загружены
	const pageReady = usePageReady([projectData], containerRef);

	// Устанавливаем pageState = "ready" только когда страница полностью готова
	useEffect(() => {
		if (pageReady) {
			setPageState("ready");
			setScrollAllowed(true);
		} else {
			setPageState("loading");
			setScrollAllowed(false);
		}
	}, [pageReady]);

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

	// Динамически изменяем CSS переменную --backgroundColor в :root
	useEffect(() => {
		if (projectData?.page_main_settings?.background_color) {
			// Устанавливаем CSS переменную --backgroundColor в :root
			document.documentElement.style.setProperty("--backgroundColor", projectData.page_main_settings.background_color);
		} else {
			// Если данные еще не загружены, устанавливаем fallback значение
			document.documentElement.style.setProperty("--backgroundColor", "#fbf9f4");
		}
		// Возвращаем исходное значение #fbf9f4
		return () => {
			document.documentElement.style.setProperty("--backgroundColor", "#fbf9f4");
		};
	}, [projectData.page_main_settings?.background_color]);

	return null;
}
