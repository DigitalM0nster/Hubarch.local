// src\components\pages\mainPage\mainPageClient.tsx

"use client";

import styles from "./styles.module.scss";
import { useEffect } from "react";
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
import { useImagesLoaded } from "@/hooks/useImagesLoaded";

export default function MainPageClient({ language }: { language: string }) {
	useScreenScroll(styles); // Хук для прокрутки экрана
	useDetectMobile();
	const { data, error, fetchData } = useMainPageStore();
	const { scrollAllowed } = useScrollStore();
	const { setPageState } = usePreloaderStore();

	// Используем новый хук для проверки загрузки изображений с максимальным временем ожидания 8 секунд
	const imagesLoaded = useImagesLoaded(data);

	useEffect(() => {
		fetchData(language);
	}, []);

	// Устанавливаем pageState = "ready" только когда данные и изображения загружены
	useEffect(() => {
		if (data && imagesLoaded) {
			setPageState("ready");
		}
	}, [data, imagesLoaded]);

	if (error) return <div>Ошибка: {error}</div>;
	if (!data) return <div>Нет данных</div>;

	return (
		<>
			<div className={`screenScroll ${scrollAllowed === true ? "" : "noScroll"}`}>
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
