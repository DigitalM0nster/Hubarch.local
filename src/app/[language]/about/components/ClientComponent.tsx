"use client";

import { useDetectMobile } from "@/hooks/useDetectMobile";
import { useScreenInit } from "@/hooks/useScreenInit";
import { useScreenScroll } from "@/hooks/useScreenScroll";
import { usePreloaderStore } from "@/store/preloaderStore";
import { useScrollStore } from "@/store/scrollStore";
import { useWindowStore } from "@/store/windowStore";
import { useEffect, useRef } from "react";
import styles from "./styles.module.scss";
import HistoryScreen from "./HistoryScreen";
import { useAboutPageStore } from "@/store/aboutPageStore";
import SpacesScreen from "./SpacesScreen";
import PartnersScreen from "./PartnersScreen";
import AwardsScreen from "@/components/awardsComponent/AwardsScreen";
import TeamScreen from "./TeamScreen";
import NextPageScreen from "@/components/nextPageComponent/NextPageComponent";
import { usePageReady } from "@/hooks/usePageReady";

export default function ClientComponent({ language }: { language: string }) {
	useScreenScroll(styles);
	useScreenInit();
	useDetectMobile();
	const { setPageState } = usePreloaderStore();
	const { scrollAllowed, setScrollAllowed } = useScrollStore();
	const { windowWidth } = useWindowStore();
	const { data, fetchData } = useAboutPageStore();
	const { isMobile } = useWindowStore();
	const containerRef = useRef<HTMLDivElement>(null);

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

	return (
		<div ref={containerRef} className="screenScroll simpleScroll">
			{data?.about_page.team_screen && <TeamScreen data={data.about_page.team_screen} language={language} />}
			{data?.about_page.history_screen && <HistoryScreen data={data.about_page.history_screen} language={language} />}
			{data?.about_page.space_screen && <SpacesScreen data={data.about_page.space_screen} language={language} />}
			{data?.about_page.partners_screen && <PartnersScreen data={data.about_page.partners_screen} language={language} />}
			{data?.about_page.awards_screen && <AwardsScreen data={data.about_page.awards_screen} language={language} />}
			{data?.about_page.next_page?.visible && <NextPageScreen data={data.about_page.next_page} language={language} />}
		</div>
	);
}
