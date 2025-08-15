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
import { useAllProjectsStore } from "@/store/allProjectsStore";

export default function MainPageClient({ language }: { language: string }) {
	useScreenScroll(styles); // Хук для прокрутки экрана
	useDetectMobile();
	const { data, error, fetchData } = useMainPageStore();
	const { projectsList, fetchAllProjects } = useAllProjectsStore();
	const { scrollAllowed, setScrollAllowed } = useScrollStore();
	const { setPageState, pageState } = usePreloaderStore();
	const containerRef = useRef<HTMLDivElement>(null);

	// Используем новый хук для проверки готовности страницы
	// Передаем массив зависимостей, которые должны быть загружены
	const pageReady = usePageReady([data, projectsList], containerRef);

	useEffect(() => {
		fetchData(language);
		fetchAllProjects(language);
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
	}, [pageReady, error]);

	if (error) return <div>Ошибка: {error}</div>;
	if (!data) return <div>Данные ещё грузятся</div>;

	return (
		<>
			<div
				ref={containerRef}
				className={`screenScroll ${scrollAllowed === true ? "" : "noScroll"} mainPage`}
				style={{ backgroundColor: data.page_main_settings?.background_color || "transparent" }}
			>
				<Screen1 />
				<Screen2 />
				<Screen3 language={language} projects={projectsList} />
				<AwardsScreen data={data.main_page_screen4} language={language} isSimpleScroll={false} />
				<Screen5 language={language} />
				<Screen6 language={language} />
				<Screen7 language={language} />
				{data.next_page?.visible && <NextPageScreen data={data.next_page} language={language} />}
			</div>
		</>
	);
}
