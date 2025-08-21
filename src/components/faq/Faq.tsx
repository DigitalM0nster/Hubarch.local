"use client";

import styles from "./styles.module.scss";
import { useState, useRef, useEffect } from "react";
import parse from "html-react-parser";

// Интерфейс для элемента FAQ
interface IFaqItem {
	icon: string | false;
	text: string;
	description: string;
}

export default function Faq({ faqData }: { faqData: IFaqItem[] | false | undefined }) {
	// Состояние для хранения активного элемента
	const [activeId, setActiveId] = useState<number | null>(null);
	// Состояние для хранения высот контента
	const [contentHeights, setContentHeights] = useState<{ [key: number]: number }>({});
	// Refs для контент блоков
	const contentRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
	// Ref для отслеживания измерения высоты
	const measurementInProgress = useRef<boolean>(false);

	// Функция для измерения высоты контента
	const measureHeight = (index: number) => {
		if (measurementInProgress.current) return;

		const element = contentRefs.current[index];
		if (element) {
			measurementInProgress.current = true;

			// Получаем gap из стилей
			const computedStyle = window.getComputedStyle(element);
			const gap = parseInt(computedStyle.gap) || 0;

			// Получаем все дочерние элементы
			const children = Array.from(element.children);

			// Считаем общую высоту с учетом gap
			let totalHeight = 0;

			// Учитываем верхний padding контейнера
			const paddingTop = parseInt(computedStyle.paddingTop) || 0;
			const paddingBottom = parseInt(computedStyle.paddingBottom) || 0;
			totalHeight += paddingTop;

			children.forEach((child, i) => {
				const childElement = child as HTMLElement;

				// Получаем реальную высоту элемента, включая его содержимое
				const childHeight = childElement.scrollHeight;
				totalHeight += childHeight;

				// Добавляем gap после каждого элемента, кроме последнего
				if (i < children.length - 1) {
					totalHeight += gap;
				}
			});

			// Добавляем нижний padding
			totalHeight += paddingBottom;

			setContentHeights((prev) => ({
				...prev,
				[index]: totalHeight,
			}));

			measurementInProgress.current = false;
		}
	};

	// Функция для обработки загрузки изображений
	const handleImageLoad = (index: number) => {
		// Добавляем небольшую задержку для гарантии, что все стили применились
		requestAnimationFrame(() => {
			measureHeight(index);
		});
	};

	// Измеряем высоту при монтировании и изменении контента
	useEffect(() => {
		if (faqData) {
			faqData.forEach((_, index) => {
				measureHeight(index);

				// Находим все изображения в контенте и добавляем обработчики загрузки
				const element = contentRefs.current[index];
				if (element) {
					const images = element.getElementsByTagName("img");
					Array.from(images).forEach((img) => {
						if (img.complete) {
							handleImageLoad(index);
						} else {
							img.addEventListener("load", () => handleImageLoad(index));
						}
					});
				}
			});
		}

		const handleResize = () => {
			if (faqData) {
				faqData.forEach((_, index) => {
					requestAnimationFrame(() => {
						measureHeight(index);
					});
				});
			}
		};

		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, [faqData]);

	// Обработчик клика по заголовку
	const handleTitleClick = (index: number) => {
		setActiveId(activeId === index ? null : index);
		requestAnimationFrame(() => {
			measureHeight(index);
		});
	};

	return (
		<div className={styles.faqBlock}>
			{faqData &&
				faqData.length > 0 &&
				faqData.map((item, index) => (
					<div key={index} className={`${styles.faqItem} ${activeId === index ? styles.active : ""}`}>
						<div className={styles.faqTitle} onClick={() => handleTitleClick(index)}>
							<div className={styles.titleStart}>
								{item.icon && (
									<div className={styles.icon}>
										<img src={item.icon} alt="" onLoad={() => handleImageLoad(index)} />
									</div>
								)}
								<div className={styles.title}>{item.text}</div>
							</div>
							<div className={styles.arrow}>
								<svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none">
									<path
										fillRule="evenodd"
										clipRule="evenodd"
										d="M4.24669 4.24669C0.793089 7.7003 0.793088 13.2997 4.24669 16.7533C7.7003 20.2069 13.2997 20.2069 16.7533 16.7533C20.2069 13.2997 20.2069 7.7003 16.7533 4.24669C13.2997 0.793087 7.7003 0.793087 4.24669 4.24669ZM3.07538 3.07538C-1.02513 7.17588 -1.02513 13.8241 3.07538 17.9246C7.17588 22.0251 13.8241 22.0251 17.9246 17.9246C22.0251 13.8241 22.0251 7.17588 17.9246 3.07538C13.8241 -1.02513 7.17588 -1.02513 3.07538 3.07538Z"
										fill="var(--mainTextColor)"
									/>
									<path d="M16.0159 10.0097L10.3483 15.6774L9.17694 14.5061L14.8446 8.8384L16.0159 10.0097Z" fill="var(--mainTextColor)" />
									<path d="M10.3484 15.6772L4.68072 10.0096L5.85204 8.83828L11.5197 14.5059L10.3484 15.6772Z" fill="var(--mainTextColor)" />
									<path d="M9.67231 14.4709L9.67231 0.924742L11.3288 0.924742L11.3288 14.4709L9.67231 14.4709Z" fill="var(--mainTextColor)" />
								</svg>
							</div>
						</div>
						<div
							className={styles.contentBlock}
							ref={(el) => {
								contentRefs.current[index] = el;
							}}
							style={{
								maxHeight: activeId === index ? `${contentHeights[index]}px` : "0px",
							}}
						>
							{parse(item.description)}
						</div>
					</div>
				))}
		</div>
	);
}
