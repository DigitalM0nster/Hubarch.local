import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import styles from "./styles.module.scss";
import { BannerData } from "@/store/allOptionsStore";
import { useHudMenuStore } from "@/store/hudMenuStore";

// Оптимизированный компонент для текстового элемента
const TextItem = React.memo(({ text, textColor }: { text: string | undefined; textColor: string }) => {
	return (
		<div className={styles.textItem}>
			<div className={styles.text}>{text}</div>
			<div className={styles.shortLines}>
				<div className={`${styles.line} ${styles.verticalLine}`} style={{ backgroundColor: textColor }} />
				<div className={`${styles.line} ${styles.rotatedLine}`} style={{ backgroundColor: textColor }} />
				<div className={`${styles.line} ${styles.horizontalLine}`} style={{ backgroundColor: textColor }} />
			</div>
		</div>
	);
});

TextItem.displayName = "TextItem";

export default function TopBanner({ bannerData, language }: { bannerData: BannerData | null; language: string }) {
	const { isTopBannerActive, setIsTopBannerActive } = useHudMenuStore();

	const scrollingBlockRef = useRef<HTMLDivElement>(null);
	const textBlockRef = useRef<HTMLDivElement>(null);
	const [scrollWidth, setScrollWidth] = useState<number>(0);
	const [animationStyle, setAnimationStyle] = useState<React.CSSProperties>({});
	const [itemsCount, setItemsCount] = useState<number>(1); // Начальное количество элементов
	const [initialCalculation, setInitialCalculation] = useState<boolean>(true);

	// Мемоизированный текст баннера
	const bannerText = useMemo(() => {
		return language === "ru" ? bannerData?.text.ru : bannerData?.text.en;
	}, [language, bannerData?.text.ru, bannerData?.text.en]);

	// Мемоизированный цвет текста
	const textColor = useMemo(() => {
		return bannerData?.text.color ? bannerData.text.color : "";
	}, [bannerData?.text.color]);

	// Функция для расчета ширины контента и создания стиля анимации - преобразована в useCallback
	const calculateScrollWidth = useCallback(() => {
		if (scrollingBlockRef.current && textBlockRef.current) {
			setAnimationStyle({
				animation: `none`, // Сначала сбрасываем анимацию
			});

			// Устанавливаем анимацию с небольшой задержкой, чтобы сброс применился
			setTimeout(() => {
				setAnimationStyle({
					animation: `scrollText ${scrollWidth * 0.02}s linear infinite`, // Скорость зависит от ширины
				});
			}, 10);
		}
	}, [scrollWidth]);

	// Функция для определения необходимого количества элементов - преобразована в useCallback
	const calculateItemsCount = useCallback(() => {
		if (textBlockRef.current && scrollingBlockRef.current) {
			const textBlockWidth = textBlockRef.current.clientWidth;

			// Если это первый расчет или количество элементов слишком мало
			if (initialCalculation || scrollingBlockRef.current.scrollWidth < textBlockWidth * 3) {
				// Оцениваем ширину одного элемента на основе текущих данных
				const currentItems = itemsCount || 1;
				const currentWidth = scrollingBlockRef.current.scrollWidth;
				const singleItemEstimatedWidth = currentWidth / currentItems;
				setScrollWidth(singleItemEstimatedWidth);

				// Сколько элементов нужно для заполнения 3х ширины textBlock
				const requiredItems = Math.ceil((textBlockWidth * 3) / singleItemEstimatedWidth);

				console.log("Current items:", currentItems);
				console.log("Estimated single item width:", singleItemEstimatedWidth);
				console.log("Required items:", requiredItems);

				// Устанавливаем новое количество элементов
				setItemsCount(requiredItems);
				setInitialCalculation(false);
			}
		}
	}, [initialCalculation, itemsCount]);

	// Рассчитываем ширину при первом рендере и при изменении данных баннера или количества элементов
	useEffect(() => {
		// Сначала устанавливаем начальное количество элементов
		if (initialCalculation) {
			calculateScrollWidth();

			// Затем через небольшую задержку пересчитываем необходимое количество
			const timer = setTimeout(() => {
				calculateItemsCount();
			}, 100);

			return () => clearTimeout(timer);
		}
	}, [bannerData, initialCalculation, calculateScrollWidth, calculateItemsCount]);

	// Отдельный useEffect для отслеживания изменений itemsCount
	useEffect(() => {
		// После обновления количества элементов снова пересчитываем ширину
		if (!initialCalculation) {
			const timer = setTimeout(() => {
				calculateScrollWidth();
			}, 100);

			return () => clearTimeout(timer);
		}
	}, [itemsCount, initialCalculation, calculateScrollWidth]);

	// Обработчик изменения размера окна
	useEffect(() => {
		const handleResize = () => {
			calculateItemsCount();
		};

		window.addEventListener("resize", handleResize);

		// Очистка обработчика при размонтировании
		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, [calculateItemsCount]);

	// Создаем стиль для @keyframes динамически
	useEffect(() => {
		if (scrollWidth > 0) {
			// Создаем и добавляем стиль с keyframes в head
			const styleEl = document.createElement("style");
			styleEl.innerHTML = `
				@keyframes scrollText {
					from { transform: translateX(0%); }
					to { transform: translateX(-${scrollWidth * itemsCount}px); }
				}
			`;

			// Удаляем предыдущий стиль, если он есть
			const prevStyle = document.getElementById("banner-animation-style");
			if (prevStyle) {
				prevStyle.remove();
			}

			// Добавляем новый стиль
			styleEl.id = "banner-animation-style";
			document.head.appendChild(styleEl);
		}
	}, [scrollWidth, itemsCount]);

	// Мемоизированный массив элементов для бегущей строки
	const textItems = useMemo(() => {
		const items = [];

		for (let i = 0; i < itemsCount; i++) {
			items.push(<TextItem key={i} text={bannerText} textColor={textColor} />);
		}

		return items;
	}, [itemsCount, bannerText, textColor]);

	// Мемоизированный стиль для фона баннера
	const bannerStyle = useMemo(() => {
		return { backgroundColor: bannerData?.background_color ? bannerData?.background_color : "" };
	}, [bannerData?.background_color]);

	return (
		<>
			{((language === "ru" && bannerData?.text.ru) || (language === "en" && bannerData?.text.en)) && (
				<div className={`${styles.topBanner} ${isTopBannerActive ? styles.active + " active" : ""}`} style={bannerStyle}>
					<div className={styles.bannerLogo}>
						<div className={styles.shortLines}>
							<div className={`${styles.line} ${styles.verticalLine}`} style={{ backgroundColor: textColor }} />
							<div className={`${styles.line} ${styles.rotatedLine}`} style={{ backgroundColor: textColor }} />
							<div className={`${styles.line} ${styles.horizontalLine}`} style={{ backgroundColor: textColor }} />
						</div>
						<div className={styles.longLines}>
							<div className={`${styles.line} ${styles.verticalLine}`} style={{ backgroundColor: textColor }} />
							<div className={`${styles.line} ${styles.rotatedLine}`} style={{ backgroundColor: textColor }} />
							<div className={`${styles.line} ${styles.horizontalLine}`} style={{ backgroundColor: textColor }} />
						</div>
					</div>
					<div className={styles.textBlock} ref={textBlockRef} style={{ color: textColor }}>
						<div className={styles.scrollingBlock} ref={scrollingBlockRef} style={animationStyle}>
							{textItems}
						</div>
					</div>
					<div className={styles.closeIcon} onClick={() => setIsTopBannerActive(false)}>
						<div className={styles.line} style={{ backgroundColor: textColor }} />
						<div className={styles.line} style={{ backgroundColor: textColor }} />
					</div>
				</div>
			)}
		</>
	);
}
