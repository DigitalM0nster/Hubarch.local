"use client";

import { useDetectMobile } from "@/hooks/useDetectMobile";
import { useScreenInit } from "@/hooks/useScreenInit";
import { useScreenScroll } from "@/hooks/useScreenScroll";
import { usePreloaderStore } from "@/store/preloaderStore";
import { useScrollStore } from "@/store/scrollStore";
import { useEffect, useRef } from "react";
import stylesForArticles from "./styles.module.scss";
import { usePageReady } from "@/hooks/usePageReady";
import styles from "./styles.module.scss";
import { useHudMenuStore } from "@/store/hudMenuStore";

export default function ClientComponent({ articleData }: { articleData: any }) {
	useScreenScroll(stylesForArticles);
	useScreenInit();
	useDetectMobile();
	const { setPageState } = usePreloaderStore();
	const { scrollAllowed, setScrollAllowed } = useScrollStore();
	const { isTopBannerActive } = useHudMenuStore();

	// Создаем ref в клиентском компоненте
	const containerRef = useRef<HTMLDivElement | null>(null);

	// Передаем массив зависимостей, которые должны быть загружены
	const pageReady = usePageReady([articleData], containerRef);

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

	// Находим контейнер по ID после монтирования компонента
	useEffect(() => {
		containerRef.current = document.getElementById("articleContainer") as HTMLDivElement;
	}, []);

	useEffect(() => {
		const screenScroll = document.querySelector(".screenScroll");
		if (scrollAllowed) {
			screenScroll?.classList.remove("noScroll");
		} else {
			screenScroll?.classList.add("noScroll");
		}
	}, [scrollAllowed]);

	return <div className={`${styles.marginScreen} ${isTopBannerActive ? styles.withTopBanner : ""}`}></div>;
}
