// src\components\pages\mainPage\screen1.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./styles.module.scss";
import parse from "html-react-parser";
import { usePreloaderStore } from "@/store/preloaderStore";
import { useApproachPageStore } from "@/store/approachPageStore";
import { useWindowStore } from "@/store/windowStore";

interface Screen {
	title: string;
	text: string;
	image: string | false;
}

export default function Screen1({ language }: { language: string }) {
	const { approachPageFetchingFinished, data } = useApproachPageStore();
	const { isMobile } = useWindowStore();
	const { markReady } = usePreloaderStore();

	// ОТМЕЧАЕМСЯ ДЛЯ ПРЕЛОАДЕРА

	/* eslint-disable react-hooks/exhaustive-deps */
	useEffect(() => {
		if (approachPageFetchingFinished) {
			markReady();
		}
		// console.log(data);
	}, [approachPageFetchingFinished]);
	/* eslint-enable react-hooks/exhaustive-deps */

	if (!data) return <div>Данные не загружены</div>;

	return (
		<>
			{data.approach_page.screens_content.map((screen: Screen, index: number) => {
				return (
					<div
						key={`screen_${index}`}
						className={`screen approachScreen ${styles.approachScreen} ${index === 0 ? "active" : ""}`}
						data-screen-lightness="light"
						data-lines-index={isMobile ? 0 : 0}
						data-mini-line-rotation={-45}
						data-position-x={50}
						data-position-y={50}
						data-horizontal-x={50}
						data-horizontal-width={100}
						data-vertical-height={100}
						data-lines-color={"dark"}
						data-left-line-x={0}
						data-left-line-height={0}
						data-right-line-x={100}
						data-right-line-height={0}
					>
						<div className={`screenContent ${styles.screenContent}`}>
							<div className={styles.textPart}>
								{screen.title != "" && (
									<div className={styles.titleBlock}>
										<div className={styles.number}>(0{index + 1})</div>
										<div className={styles.title}>{screen.title}</div>
									</div>
								)}
								{screen.text != "" && (
									<div className={styles.textBlock}>
										<div className={styles.icon}>
											<img src="/images/approach/icon_1.svg" alt="icon_1" />
										</div>
										<div className={styles.text}>{parse(screen.text)}</div>
									</div>
								)}
							</div>
							<div className={styles.imagePart}>
								<div className={styles.image}>
									{screen.image ? (
										<img src={screen.image} alt={`image_${index + 1}`} />
									) : (
										<img src="/images/approach/template_image.png" alt={`image_${index + 1}`} />
									)}
								</div>
							</div>
						</div>
					</div>
				);
			})}
		</>
	);
}
