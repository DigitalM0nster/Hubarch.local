"use client";

import { useDetectMobile } from "@/hooks/useDetectMobile";
import { useScreenInit } from "@/hooks/useScreenInit";
import { useScreenScroll } from "@/hooks/useScreenScroll";
import { usePreloaderStore } from "@/store/preloaderStore";
import { useScrollStore } from "@/store/scrollStore";
import { useEffect, useRef, useState } from "react";
import styles from "./styles.module.scss";
import parse from "html-react-parser";
import { usePageReady } from "@/hooks/usePageReady";
import { useDocumentsPageStore } from "@/store/documentsPageStore";

export default function DocumentationPageClient({ language }: { language: string }) {
	useScreenScroll(styles);
	useScreenInit();
	useDetectMobile();
	const { setPageState } = usePreloaderStore();
	const { scrollAllowed, setScrollAllowed } = useScrollStore();
	const { data, fetchData } = useDocumentsPageStore();
	const containerRef = useRef<HTMLDivElement>(null);
	// Передаем массив зависимостей, которые должны быть загружены
	const pageReady = usePageReady([data], containerRef);

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

	useEffect(() => {
		const screenScroll = document.querySelector(".screenScroll");
		if (scrollAllowed) {
			screenScroll?.classList.remove("noScroll");
		} else {
			screenScroll?.classList.add("noScroll");
		}
	}, [scrollAllowed]);

	useEffect(() => {
		if (data?.page_main_settings?.background_color) {
			// Устанавливаем CSS переменную --backgroundColor в :root
			document.documentElement.style.setProperty("--backgroundColor", data.page_main_settings.background_color);
			document.documentElement.style.setProperty("--backgroundColorTransparent", data.page_main_settings.background_color + "40");
		} else {
			// Если данные еще не загружены, устанавливаем fallback значение
			document.documentElement.style.setProperty("--backgroundColor", "#fbf9f4");
			document.documentElement.style.setProperty("--backgroundColorTransparent", "#fbf9f440");
		}

		if (data?.page_main_settings?.text_is_light) {
			// Устанавливаем CSS переменную --backgroundColor в :root
			document.documentElement.style.setProperty("--mainTextColor", "#fbf9f4");
			document.documentElement.style.setProperty("--mainTextColorTransparent", "#fbf9f440");
		} else {
			// Если данные еще не загружены, устанавливаем fallback значение
			document.documentElement.style.setProperty("--mainTextColor", "#101118");
			document.documentElement.style.setProperty("--mainTextColorTransparent", "#10111840");
		}

		// Возвращаем исходное значение #fbf9f4
		return () => {
			document.documentElement.style.setProperty("--backgroundColor", "#fbf9f4");
			document.documentElement.style.setProperty("--backgroundColorTransparent", "#fbf9f440");
			document.documentElement.style.setProperty("--mainTextColor", "#101118");
			document.documentElement.style.setProperty("--mainTextColorTransparent", "#10111840");
		};
	}, [data?.page_main_settings?.background_color, data?.page_main_settings?.text_is_light]);

	return (
		<>
			<div ref={containerRef} className="screenScroll simpleScroll">
				<div
					className={`screen active ${styles.screen} ${styles.screen1}`}
					data-screen-lightness={data?.page_main_settings?.text_is_light ? "dark" : "light"}
					data-lines-index={1}
					data-mini-line-rotation={-45}
					data-position-x={50}
					data-position-y={50}
					data-vertical-y={50}
					data-horizontal-x={50}
					data-horizontal-width={100}
					data-vertical-height={100}
					data-lines-color={"dark"}
					data-left-line-x={0}
					data-left-line-height={0}
					data-right-line-x={0}
					data-right-line-height={0}
					data-lines-opacity={0.0}
				>
					<div className={`screenContent ${styles.screenContent}`}>
						<div className={styles.documentsBlock}>
							{data?.documents_list.map((document, index) => (
								<a key={`document_${index}_${document.name}`} href={document.file} target="_blank" rel="noopener noreferrer" className={styles.documentItem}>
									{document.name}
								</a>
							))}
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
