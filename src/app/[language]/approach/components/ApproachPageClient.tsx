// src\components\pages\mainPage\mainPageClient.tsx

"use client";

import styles from "./styles.module.scss";
import { useEffect } from "react";
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

export default function ApproachPageClient({ language }: { language: string }) {
	useScreenScroll(styles); // Хук для прокрутки экрана
	useDetectMobile();
	const { setTotal } = usePreloaderStore();
	const { scrollAllowed } = useScrollStore();

	const { data, error, fetchData } = useApproachPageStore();

	// Вызываем фетч при смене языка

	/* eslint-disable react-hooks/exhaustive-deps */
	useEffect(() => {
		fetchData(language);
	}, []);

	/* eslint-enable react-hooks/exhaustive-deps */

	// Указываем сколько компонентов должно отметиться
	useEffect(() => {
		const timeout = setTimeout(() => {
			setTotal(0);
		}, 0);

		return () => clearTimeout(timeout);
	}, [setTotal]);

	if (error) return <div>Ошибка: {error}</div>;
	if (!data) return <div>Нет данных</div>;

	return (
		<>
			<div className={`screenScroll ${scrollAllowed === true ? "" : "noScroll"}`}>
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
			</div>
		</>
	);
}
