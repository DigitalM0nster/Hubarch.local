// src\components\pages\mainPage\mainPageClient.tsx

"use client";

import { useEffect } from "react";
import { useMainPageStore, MainPageData } from "@/store/mainPageStore";
import { useScreenScroll } from "@/hooks/useScreenScroll";
import Screen1 from "./screen1";
import Screen2 from "./screen2";
import styles from "./styles.module.scss";
import { usePreloaderStore } from "@/store/preloaderStore";
import Screen3 from "./screen3";
import { useDetectMobile } from "@/hooks/useDetectMobile";

export default function MainPageClient({ language }: { language: string }) {
	useScreenScroll(styles); // Хук для прокрутки экрана
	useDetectMobile();
	const { data, loadedData, error, fetchData } = useMainPageStore();
	const { setTotal } = usePreloaderStore();

	// Вызываем фетч при смене языка
	useEffect(() => {
		fetchData(language);
	}, []);

	// Указываем сколько компонентов должно отметиться
	useEffect(() => {
		const timeout = setTimeout(() => {
			setTotal(3);
		}, 0);

		return () => clearTimeout(timeout);
	}, []);

	if (!loadedData) return <div>Загрузка...</div>;
	if (error) return <div>Ошибка: {error}</div>;
	if (!data) return <div>Нет данных</div>;

	return (
		<>
			<div className="screenScroll">
				<Screen1 />
				<Screen2 />
				<Screen3 language={language} />
			</div>
		</>
	);
}
