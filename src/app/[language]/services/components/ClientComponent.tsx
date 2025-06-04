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
import { useServicesPageStore } from "@/store/servicesPageStore";
export default function ClientComponent({ language }: { language: string }) {
	useScreenScroll(stylesForProjects);
	useScreenInit();
	useDetectMobile();
	const { setTotal, markReady } = usePreloaderStore();
	const { scrollAllowed } = useScrollStore();
	const { windowWidth } = useWindowStore();
	const { fetchData, servicesPageFetchingFinished } = useServicesPageStore();

	useEffect(() => {
		fetchData(language);
		setTotal(0);
		markReady();
	}, []);

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
