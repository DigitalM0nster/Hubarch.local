// src\app\[language]\about\components\HistoryScreen.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./styles.module.scss";
import { Year } from "@/store/aboutPageStore";
import parse from "html-react-parser";

interface HistoryScreenData {
	background_title: string;
	screen_text: string;
	years: Year[] | false;
}

export default function HistoryScreen({ data, language }: { data: HistoryScreenData; language: string }) {
	// Состояние для хранения индекса активного элемента
	const [activeItemIndex, setActiveItemIndex] = useState<number | null>(0);

	if (!data) return <div>Данные не загружены</div>;

	return (
		<div
			className={`screen ${styles.screen} ${styles.historyScreen}`}
			data-screen-lightness="light"
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
			data-lines-opacity={1.0}
		>
			<div className={`screenContent ${styles.screenContent}`}>
				<div className={`titleBackground ${styles.titleBackground}`}>{data.background_title ? data.background_title : language === "ru" ? "История" : "History"}</div>
				<div className={styles.historyContainer}>
					{data.screen_text != "" && <div className={styles.historyText}>{parse(data.screen_text)}</div>}
					{data.years != false && (
						<div className={styles.historyItemsBlock}>
							<div className={styles.historyItems}>
								{data.years.map((year, index) => {
									return (
										<div
											className={`${styles.historyItem} ${activeItemIndex === index ? styles.active : ""}`}
											key={`historyItem_${index}`}
											onMouseEnter={() => setActiveItemIndex(index)}
										>
											<div className={styles.background} style={{ backgroundColor: year.color }} />
											<div className={styles.cardBlock}>
												<div className={`${styles.line}`} style={{ backgroundColor: activeItemIndex === index ? year.color : "#4F505F29" }} />
												<div className={styles.card} style={{ backgroundColor: year.color }}>
													{year.image && <img src={year.image} alt={`hubarch ${year.year}`} />}
												</div>
											</div>
											<div className={styles.text} style={{ color: year.color_text }}>
												{parse(year.text)}
											</div>
											<div className={styles.yearBlock}>
												<div className={`${styles.line}`} style={{ backgroundColor: activeItemIndex === index ? year.color : "#4F505F29" }} />
												<div className={styles.year}>{year.year}</div>
											</div>
										</div>
									);
								})}
							</div>
							<div className={styles.historyNumberBlock}>
								<div className={styles.text}>Построено более:</div>
								{data.years.map((year, index) => {
									// Форматирование числа с разделением тысяч пробелами
									const formattedNumber = year.number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
									return (
										<div className={`${styles.number} ${activeItemIndex === index ? styles.active : ""}`} key={`yearNumber_${index}`}>{`${formattedNumber} ${
											language === "ru" ? "м²" : "m²"
										}`}</div>
									);
								})}
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
