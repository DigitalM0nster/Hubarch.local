// src\components\pages\mainPage\mainPageClient.tsx

"use client";

import styles from "./styles.module.scss";
import { useEffect } from "react";
import { useMainPageStore } from "@/store/mainPageStore";
import { useScreenScroll } from "@/hooks/useScreenScroll";
import Screen1 from "./screen1";
import Screen2 from "./screen2";
import Screen3 from "./screen3";
import Screen4 from "./screen4";
import Screen5 from "./screen5";
import Screen6 from "./screen6";
import { usePreloaderStore } from "@/store/preloaderStore";
import { useDetectMobile } from "@/hooks/useDetectMobile";
import { useScrollStore } from "@/store/scrollStore";
import { useAreaRangeStore } from "@/store/areaRangeStore";
import Screen7 from "./screen7";
import { useAwardsAndProjectsStore } from "@/store/awardsAndProjectsStore";

export default function MainPageClient({ language }: { language: string }) {
	useScreenScroll(styles); // Хук для прокрутки экрана
	useDetectMobile();
	const { data, loadedData, error, fetchData } = useMainPageStore();
	const { fetchAwardsAndProjects } = useAwardsAndProjectsStore();
	const { fetchRanges } = useAreaRangeStore();
	const { setTotal } = usePreloaderStore();
	const { scrollAllowed } = useScrollStore();

	// Вызываем фетч при смене языка

	/* eslint-disable react-hooks/exhaustive-deps */
	useEffect(() => {
		fetchData(language);
		fetchAwardsAndProjects(language);
		fetchRanges(); // ← добавляем это!
	}, []);

	/* eslint-enable react-hooks/exhaustive-deps */

	// Указываем сколько компонентов должно отметиться
	useEffect(() => {
		const timeout = setTimeout(() => {
			setTotal(0);
		}, 0);

		return () => clearTimeout(timeout);
	}, [setTotal]);

	if (!loadedData) return <div>Загрузка...</div>;
	if (error) return <div>Ошибка: {error}</div>;
	if (!data) return <div>Нет данных</div>;

	return (
		<>
			<div className={`screenScroll ${scrollAllowed === true ? "" : "noScroll"}`}>
				<Screen1 />
				{/* <Screen2 />
				<Screen3 language={language} />
				<Screen4 language={language} />
				<Screen5 language={language} />
				<Screen6 language={language} />
				<Screen7 language={language} /> */}
			</div>
		</>
	);
}
