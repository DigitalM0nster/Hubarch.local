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
import { useServicesPageStore } from "@/store/servicesPageStore";
import { usePageReady } from "@/hooks/usePageReady";
import Screen1 from "./Screen1";
import NextPageServicesScreen from "./NextPageServicesScreen";
import Screen2 from "./Screen2";
import Screen3 from "./Screen3";
import Screen7 from "@/components/pages/mainPage/screen7";

export default function ClientComponent({ language }: { language: string }) {
	useScreenScroll(stylesForProjects);
	useScreenInit();
	useDetectMobile();
	const { setPageState } = usePreloaderStore();
	const { scrollAllowed, setScrollAllowed } = useScrollStore();
	const { windowWidth } = useWindowStore();
	const { fetchData, data } = useServicesPageStore();

	const containerRef = useRef<HTMLDivElement>(null);

	// Находим контейнер по ID после монтирования компонента
	useEffect(() => {
		containerRef.current = document.getElementById("servicesContainer") as HTMLDivElement;
	}, []);

	// Используем хук для проверки готовности страницы
	// Передаем массив зависимостей, которые должны быть загружены
	const pageReady = usePageReady([data], containerRef);

	useEffect(() => {
		fetchData(language);
	}, []);

	// Устанавливаем pageState = "ready" только когда страница полностью готова
	useEffect(() => {
		if (pageReady) {
			console.log(data);
			setPageState("ready");
			setScrollAllowed(true);
		} else {
			setPageState("loading");
			setScrollAllowed(false);
		}
	}, [pageReady]);

	// Динамически изменяем CSS переменную --backgroundColor в :root
	useEffect(() => {
		if (data?.page_main_settings?.background_color) {
			// Устанавливаем CSS переменную --backgroundColor в :root
			document.documentElement.style.setProperty("--backgroundColor", data.page_main_settings.background_color);
			document.documentElement.style.setProperty("--backgroundColorTransparent", data.page_main_settings.background_color + "40");
		} else {
			// Если данные еще не загружены, устанавливаем fallback значение
			document.documentElement.style.setProperty("--backgroundColor", "#fbf9f4");
			document.documentElement.style.setProperty("--backgroundColorTransparent", "#fbf9f440");
		}

		if (data?.page_main_settings?.text_is_light) {
			// Устанавливаем CSS переменную --backgroundColor в :root
			document.documentElement.style.setProperty("--mainTextColor", "#fbf9f4");
			document.documentElement.style.setProperty("--mainTextColorTransparent", "#fbf9f440");
		} else {
			// Если данные еще не загружены, устанавливаем fallback значение
			document.documentElement.style.setProperty("--mainTextColor", "#101118");
			document.documentElement.style.setProperty("--mainTextColorTransparent", "#10111840");
		}

		// Возвращаем исходное значение #fbf9f4
		return () => {
			document.documentElement.style.setProperty("--backgroundColor", "#fbf9f4");
			document.documentElement.style.setProperty("--backgroundColorTransparent", "#fbf9f440");
			document.documentElement.style.setProperty("--mainTextColor", "#101118");
			document.documentElement.style.setProperty("--mainTextColorTransparent", "#10111840");
		};
	}, [data?.page_main_settings?.background_color, data?.page_main_settings?.text_is_light]);

	useEffect(() => {
		const screenScroll = document.querySelector(".screenScroll");
		if (scrollAllowed) {
			screenScroll?.classList.remove("noScroll");
		} else {
			screenScroll?.classList.add("noScroll");
		}
	}, [scrollAllowed]);

	useEffect(() => {}, [windowWidth]);

	return (
		<div className="screenScroll simpleScroll" id="servicesContainer">
			<Screen1 language={language} />
			<Screen2 language={language} />
			<Screen3 language={language} />
			<Screen7 language={language} />
			<NextPageServicesScreen language={language} />
		</div>
	);
}
