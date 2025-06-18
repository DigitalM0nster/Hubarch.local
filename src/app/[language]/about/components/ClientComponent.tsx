"use client";

import { useDetectMobile } from "@/hooks/useDetectMobile";
import { useScreenInit } from "@/hooks/useScreenInit";
import { useScreenScroll } from "@/hooks/useScreenScroll";
import { usePreloaderStore } from "@/store/preloaderStore";
import { useScrollStore } from "@/store/scrollStore";
import { useWindowStore } from "@/store/windowStore";
import { useEffect, useState } from "react";
import styles from "./styles.module.scss";
// import screen4Styles from "@/components/pages/mainPage/styles.module.scss";
import parse from "html-react-parser";
import HistoryScreen from "./HistoryScreen";
import { useAboutPageStore } from "@/store/aboutPageStore";
import SpacesScreen from "./SpacesScreen";
import PartnersScreen from "./PartnersScreen";
import AwardsScreen from "@/components/awardsComponent/AwardsScreen";
import TeamScreen from "./TeamScreen";

export default function ClientComponent({ language }: { language: string }) {
	useScreenScroll(styles);
	useScreenInit();
	useDetectMobile();
	const { setTotal, markReady } = usePreloaderStore();
	const { scrollAllowed } = useScrollStore();
	const { windowWidth } = useWindowStore();
	const { data, fetchData } = useAboutPageStore();
	const { isMobile } = useWindowStore();
	const [activeMapItem, setActiveMapItem] = useState<number | null>(null);

	useEffect(() => {
		fetchData(language);
		setTotal(0);
		markReady();
		console.log(data);
	}, []);

	useEffect(() => {
		const screenScroll = document.querySelector(".screenScroll");
		if (scrollAllowed) {
			screenScroll?.classList.remove("noScroll");
		} else {
			screenScroll?.classList.add("noScroll");
		}
	}, [scrollAllowed]);

	return (
		<div className="screenScroll simpleScroll">
			{data?.about_page.team_screen && <TeamScreen data={data.about_page.team_screen} language={language} />}
			{data?.about_page.history_screen && <HistoryScreen data={data.about_page.history_screen} language={language} />}
			<SpacesScreen />
			{data?.about_page.partners_screen && <PartnersScreen data={data.about_page.partners_screen} language={language} />}
			{data?.about_page.awards_screen && <AwardsScreen data={data.about_page.awards_screen} language={language} />}
		</div>
	);
}
