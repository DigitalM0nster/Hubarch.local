"use client";

import { useEffect } from "react";
import { useMainPageStore, MainPageData } from "@/store/mainPageStore";
import { useScreenScroll } from "@/hooks/useScreenScroll";
import Screen1 from "./screen1";
import Screen2 from "./screen2";
import styles from "./styles.module.scss";
import { preloaderStore } from "@/store/preloaderStore";
import Screen3 from "./screen3";
import { useDetectMobile } from "@/hooks/useDetectMobile";

preloaderStore.setTotal(3); // тут ты указываешь, сколько компонентов должно "отметиться"

export default function MainPageClient({ language }: { language: string }) {
	useScreenScroll(styles); // Хук для прокрутки экрана
	const { data, loadedData, error, fetchData } = useMainPageStore();

	// ⬇️ Вызываем fetch при монтировании, если данных ещё нет
	useEffect(() => {
		if (!data) fetchData(language);
	}, [data, fetchData]);

	// вызываем фетч при смене языка
	useEffect(() => {
		if (data) {
			fetchData(language);
		}
	}, [language]);

	useEffect(() => {
		console.log("client ready");
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
