// src\components\pages\mainPage\mainPageClient.tsx

"use client";

import styles from "./styles.module.scss";
import { useEffect, useRef } from "react";
import { useMainPageStore } from "@/store/mainPageStore";
import { useScreenScroll } from "@/hooks/useScreenScroll";
import Screen1 from "./screen1";
import Screen2 from "./screen2";
import Screen3 from "./screen3";
import Screen5 from "./screen5";
import Screen6 from "./screen6";
import { usePreloaderStore } from "@/store/preloaderStore";
import { useDetectMobile } from "@/hooks/useDetectMobile";
import { useScrollStore } from "@/store/scrollStore";
import Screen7 from "./screen7";
import AwardsScreen from "@/components/awardsComponent/AwardsScreen";
import NextPageScreen from "@/components/nextPageComponent/NextPageComponent";
import { usePageReady } from "@/hooks/usePageReady";

export default function MainPageClient({ language }: { language: string }) {
	useScreenScroll(styles); // Хук для прокрутки экрана
	useDetectMobile();
	const { data, error, fetchData } = useMainPageStore();
	const { scrollAllowed, setScrollAllowed } = useScrollStore();
	const { setPageState, pageState } = usePreloaderStore();
	const containerRef = useRef<HTMLDivElement>(null);

	// Используем новый хук для проверки готовности страницы
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

	if (error) return <div>Ошибка: {error}</div>;
	if (!data) return <div>Нет данных</div>;

	return (
		<>
			<div ref={containerRef} className={`screenScroll ${scrollAllowed === true ? "" : "noScroll"}`}>
				<Screen1 />
				<Screen2 />
				<Screen3 language={language} />
				<AwardsScreen data={data.main_page_screen4} language={language} />
				<Screen5 language={language} />
				<Screen6 language={language} />
				<Screen7 language={language} />
				{data.next_page?.visible && <NextPageScreen data={data.next_page} language={language} />}
			</div>
		</>
	);
}
