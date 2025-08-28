// src\app\[language]\about\components\HistoryScreen.tsx
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import styles from "./styles.module.scss";
import { Year } from "@/store/aboutPageStore";
import parse from "html-react-parser";
interface HistoryScreenData {
	background_title: string;
	screen_text: string;
	years: Year[] | false;
}

export default function HistoryScreen({ data, language, text_is_light }: { data: HistoryScreenData; language: string; text_is_light: boolean }) {
	// Состояние для хранения индекса активного элемента
	const [activeItemIndex, setActiveItemIndex] = useState<number | null>(0);

	// Ссылка на контейнер с карточками для отслеживания скролла
	const historyItemsRef = useRef<HTMLDivElement>(null);

	// Функция для определения активной карточки на мобильной версии
	const calculateActiveItemIndex = useCallback(() => {
		if (!historyItemsRef.current || window.innerWidth > 768) return;

		const container = historyItemsRef.current;
		const items = container.querySelectorAll(`.${styles.historyItem}`);
		const containerRect = container.getBoundingClientRect();
		const containerCenter = containerRect.left + containerRect.width / 2;

		// Сначала проверяем особые случаи для первой и последней карточки
		if (data.years && data.years.length > 1) {
			// Проверяем первую карточку
			const firstItem = items[0];
			const secondItem = items[1];
			const firstItemRect = firstItem.getBoundingClientRect();
			const secondItemRect = secondItem.getBoundingClientRect();
			const secondItemCenter = secondItemRect.left + secondItemRect.width / 2;

			// Первая карточка активна, если центр экрана слева от центра второй карточки
			if (containerCenter < secondItemCenter) {
				setActiveItemIndex(0);
				return;
			}

			// Проверяем последнюю карточку
			const lastItem = items[items.length - 1];
			const preLastItem = items[items.length - 2];
			const preLastItemRect = preLastItem.getBoundingClientRect();
			const preLastItemCenter = preLastItemRect.left + preLastItemRect.width / 2;

			// Последняя карточка активна, если центр экрана справа от центра предпоследней карточки
			if (containerCenter > preLastItemCenter) {
				setActiveItemIndex(items.length - 1);
				return;
			}
		}

		// Если не сработали особые случаи, находим ближайшую к центру карточку
		let closestIndex = 0;
		let minDistance = Infinity;

		items.forEach((item, index) => {
			const itemRect = item.getBoundingClientRect();
			const itemCenter = itemRect.left + itemRect.width / 2;
			const distance = Math.abs(containerCenter - itemCenter);

			if (distance < minDistance) {
				minDistance = distance;
				closestIndex = index;
			}
		});

		setActiveItemIndex(closestIndex);
	}, [data.years]);

	// Обработчик скролла для обновления активной карточки
	useEffect(() => {
		if (window.innerWidth > 768) return;

		const container = historyItemsRef.current;
		if (!container) return;

		// Функция для throttling скролла (оптимизация производительности)
		let ticking = false;
		const handleScroll = () => {
			if (!ticking) {
				requestAnimationFrame(() => {
					calculateActiveItemIndex();
					ticking = false;
				});
				ticking = true;
			}
		};

		container.addEventListener("scroll", handleScroll);

		return () => {
			container.removeEventListener("scroll", handleScroll);
		};
	}, [calculateActiveItemIndex]);

	// Инициализация активного элемента при загрузке
	useEffect(() => {
		if (window.innerWidth <= 768) {
			calculateActiveItemIndex();
		}
	}, [calculateActiveItemIndex]);

	if (!data) return <div>Данные не загружены</div>;

	return (
		<div
			className={`screen ${styles.screen} ${styles.historyScreen}`}
			data-screen-lightness={text_is_light ? "dark" : "light"}
			data-lines-index={0}
			data-mini-line-rotation={-45}
			data-position-x={50}
			data-position-y={50}
			data-vertical-y={50}
			data-horizontal-x={50}
			data-horizontal-width={100}
			data-vertical-height={100}
			data-lines-color={text_is_light ? "light" : "dark"}
			data-left-line-x={0}
			data-left-line-height={0}
			data-right-line-x={0}
			data-right-line-height={0}
			data-lines-opacity={1.0}
		>
			<div className={`screenContent ${styles.screenContent}`}>
				<div className={styles.historyContainer}>
					{data.screen_text != "" && <div className={styles.historyText}>{parse(data.screen_text)}</div>}
					{data.years != false && (
						<div className={styles.historyItemsBlock}>
							<div className={`titleBackground ${styles.titleBackground}`}>
								{data.background_title ? data.background_title : language === "ru" ? "История" : "History"}
							</div>
							<div className={styles.historyItems} ref={historyItemsRef}>
								{data.years.map((year, index) => {
									return (
										<div
											className={`${styles.historyItem} ${activeItemIndex === index ? styles.active : ""}`}
											key={`historyItem_${index}`}
											onMouseEnter={() => setActiveItemIndex(index)}
											style={{
												width:
													window.innerWidth > 768
														? activeItemIndex === index
															? `var(--historyItemActiveWidth)`
															: `calc((100% - var(--historyItemActiveWidth)) / ${
																	data.years != false ? data.years.length - 1 : 11
															  } - var(--historyItemsGap))`
														: "",
												minWidth:
													window.innerWidth > 768
														? activeItemIndex === index
															? `var(--historyItemActiveWidth)`
															: `calc((100% - var(--historyItemActiveWidth)) / ${
																	data.years != false ? data.years.length - 1 : 11
															  } - var(--historyItemsGap))`
														: "",
											}}
										>
											<div className={styles.background} style={{ backgroundColor: year.color }} />
											<div className={styles.cardBlock}>
												<div
													className={`${styles.line}`}
													style={{ backgroundColor: window.innerWidth > 768 ? (activeItemIndex === index ? year.color : "#4F505F29") : "#4F505F29" }}
												/>
												<div className={styles.card} style={{ backgroundColor: year.color }}>
													{year.image && <img src={year.image} alt={`hubarch ${year.year}`} />}
												</div>
											</div>
											<div className={styles.text} style={{ color: year.color_text }}>
												{parse(year.text)}
											</div>
											<div className={styles.yearBlock}>
												<div
													className={`${styles.line}`}
													style={{ backgroundColor: window.innerWidth > 768 ? (activeItemIndex === index ? year.color : "#4F505F29") : "#4F505F29" }}
												/>
												<div className={styles.year}>{year.year}</div>
											</div>
										</div>
									);
								})}
							</div>
							<div className={styles.historyNumberBlock}>
								<div className={styles.text}>{language === "ru" ? "Построено более:" : "Built more than:"}</div>
								{/* Показываем только одно число на мобильной версии */}
								{window.innerWidth > 768
									? // На десктопе показываем все числа
									  data.years.map((year, index) => {
											const formattedNumber = year.number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
											return (
												<div
													className={`${styles.number} ${activeItemIndex === index ? styles.active : ""}`}
													key={`yearNumber_${index}`}
												>{`${formattedNumber} ${language === "ru" ? "м²" : "m²"}`}</div>
											);
									  })
									: // На мобильной версии показываем только активное число
									  activeItemIndex !== null &&
									  data.years[activeItemIndex] && (
											<div className={`${styles.number} ${styles.active}`}>
												{`${data.years[activeItemIndex].number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} ${language === "ru" ? "м²" : "m²"}`}
											</div>
									  )}
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
