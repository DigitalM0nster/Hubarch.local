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
			setPageState("ready");
			setScrollAllowed(true);
		} else {
			setPageState("loading");
			setScrollAllowed(false);
		}
	}, [pageReady]);

	useEffect(() => {
		const screenScroll = document.querySelector(".screenScroll");
		if (scrollAllowed) {
			screenScroll?.classList.remove("noScroll");
		} else {
			screenScroll?.classList.add("noScroll");
		}
	}, [scrollAllowed]);

	useEffect(() => {}, [windowWidth]);

	return null;
}
