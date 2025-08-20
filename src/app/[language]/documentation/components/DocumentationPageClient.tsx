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
import { useDocumentationPageStore } from "@/store/documentationPageStore";

export default function DocumentationPageClient({ language }: { language: string }) {
	useScreenScroll(styles);
	useScreenInit();
	useDetectMobile();
	const { setPageState } = usePreloaderStore();
	const { scrollAllowed, setScrollAllowed } = useScrollStore();
	const { data, fetchData } = useDocumentationPageStore();
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
						<div className={styles.screenContentTitle}>{language === "ru" ? "Список документов:" : "Documentation list:"}</div>
						<div className={styles.documentsBlock}>
							{data?.documents_list &&
								data?.documents_list.length > 0 &&
								data?.documents_list.map((document, index) => {
									return (
										<a
											key={`document_${index}_${document.document_name}`}
											href={document.file_url || `/${language}/404`}
											target="_blank"
											rel="noopener noreferrer"
											className={styles.documentItem}
										>
											<div className={styles.documentIcon}>
												<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48px" height="48px">
													<path
														d="M 13 4 C 10.250484 4 8 6.2504839 8 9 L 8 40 C 8 42.749516 10.250484 45 13 45 L 35 45 C 37.749516 45 40 42.749516 40 40 L 40 20 A 1.0001 1.0001 0 1 0 38 20 L 38 40 C 38 41.668484 36.668484 43 35 43 L 13 43 C 11.331516 43 10 41.668484 10 40 L 10 9 C 10 7.3315161 11.331516 6 13 6 L 26.757812 6 C 26.848824 6 26.910938 6.0874954 27 6.0996094 L 27 13 C 27 15.197334 28.802666 17 31 17 L 39 17 A 1.0001 1.0001 0 0 0 39.707031 15.292969 L 29.585938 5.171875 C 28.836398 4.4210018 27.818469 4 26.757812 4 L 13 4 z M 29 7.4140625 L 36.585938 15 L 31 15 C 29.883334 15 29 14.116666 29 13 L 29 7.4140625 z M 16 24 A 1.0001 1.0001 0 1 0 16 26 L 32 26 A 1.0001 1.0001 0 1 0 32 24 L 16 24 z M 16 29 A 1.0001 1.0001 0 1 0 16 31 L 32 31 A 1.0001 1.0001 0 1 0 32 29 L 16 29 z M 16 34 A 1.0001 1.0001 0 1 0 16 36 L 26 36 A 1.0001 1.0001 0 1 0 26 34 L 16 34 z"
														fill="var(--mainTextColor)"
													/>
												</svg>
											</div>
											<span className={styles.documentName}>{document.document_name}</span>
										</a>
									);
								})}
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
