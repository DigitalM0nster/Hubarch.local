// src\components\pages\mainPage\mainPageClient.tsx

"use client";

import styles from "./styles.module.scss";
import { useEffect, useRef } from "react";
import { useScreenScroll } from "@/hooks/useScreenScroll";

import { usePreloaderStore } from "@/store/preloaderStore";
import { useDetectMobile } from "@/hooks/useDetectMobile";
import { useScrollStore } from "@/store/scrollStore";
import { useApproachPageStore } from "@/store/approachPageStore";
import Screen1 from "./Screen1";
import ApproachBackground from "./ApproachBackground";
import Screen2 from "./Screen2";
import ApplicationComponent from "@/components/applicationComponent/ApplicationComponent";
import Screen7 from "@/components/pages/mainPage/screen7";
import NextPageScreen from "@/components/nextPageComponent/NextPageComponent";
import { usePageReady } from "@/hooks/usePageReady";

export default function ApproachPageClient({ language }: { language: string }) {
	useScreenScroll(styles); // Хук для прокрутки экрана
	useDetectMobile();
	const { setPageState } = usePreloaderStore();
	const { scrollAllowed, setScrollAllowed } = useScrollStore();

	const { data, error, fetchData } = useApproachPageStore();

	const containerRef = useRef<HTMLDivElement>(null);

	// Используем хук для проверки готовности страницы
	// Передаем массив зависимостей, которые должны быть загружены
	const pageReady = usePageReady([data], containerRef);

	// Вызываем фетч при смене языка
	useEffect(() => {
		fetchData(language);
	}, [language]);

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
				<div className={styles.backgroundScreen}>
					<div className={`screenContent ${styles.screenContent}`}>
						<div className={styles.image}>
							<ApproachBackground language={language} />
						</div>
					</div>
				</div>
				<Screen1 language={language} />
				<Screen2 language={language} />
				<ApplicationComponent language={language} data={data?.approach_page?.application_screen} />
				<Screen7 language={language} />
				{data?.approach_page?.next_page?.visible && <NextPageScreen data={data.approach_page.next_page} language={language} />}
			</div>
		</>
	);
}
