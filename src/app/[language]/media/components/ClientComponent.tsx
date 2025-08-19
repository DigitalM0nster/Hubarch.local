"use client";

import { useDetectMobile } from "@/hooks/useDetectMobile";
import { useScreenInit } from "@/hooks/useScreenInit";
import { useScreenScroll } from "@/hooks/useScreenScroll";
import { usePreloaderStore } from "@/store/preloaderStore";
import { useScrollStore } from "@/store/scrollStore";
import { useWindowStore } from "@/store/windowStore";
import { useEffect, useRef, useState } from "react";
import styles from "./styles.module.scss";
import { Article, useAllArticlesStore } from "@/store/allArticlesStore";
import Link from "next/link";
import parse from "html-react-parser";
import LinkWithPreloader from "@/components/preloader/LinkWithPreloader";
import { usePageReady } from "@/hooks/usePageReady";
import { useMediaPageStore } from "@/store/mediaPageStore";
import { useHudMenuStore } from "@/store/hudMenuStore";

// Компонент для отображения карточки статьи
const ArticleCard = ({ article, language }: { article: Article; language: string }) => {
	return (
		<div className={styles.articleCard}>
			<div className={styles.articleDate}>{new Date(article.date).toLocaleDateString(language === "ru" ? "ru-RU" : "en-US")}</div>
			<div className={styles.line} />
			<LinkWithPreloader href={`/${language}/media/${article.slug}`} className={styles.articleContent}>
				<div className={styles.articleTextContent}>
					<div className={styles.articleTitle}>{parse(article.title.rendered)}</div>
					{article.acf.description && <div className={styles.articleDescription}>{parse(article.acf.description)}</div>}
				</div>
				<div className={styles.line} />
				<div className={styles.articleImage}>
					<img src={article.acf.image != false ? article.acf.image : "/images/media/article_placeholder.png"} alt={article.title.rendered} />
				</div>
				<div className={styles.articleButton}>
					<div className={styles.text}>{language === "ru" ? "Подробнее" : "Read more"}</div>
					<div className={styles.icon}>
						<svg xmlns="http://www.w3.org/2000/svg" width="22" height="21" viewBox="0 0 22 21" fill="none">
							<path
								fillRule="evenodd"
								clipRule="evenodd"
								d="M4.74669 16.7533C8.2003 20.2069 13.7997 20.2069 17.2533 16.7533C20.7069 13.2997 20.7069 7.7003 17.2533 4.24669C13.7997 0.793087 8.2003 0.793087 4.74669 4.24669C1.29309 7.7003 1.29309 13.2997 4.74669 16.7533ZM3.57538 17.9246C7.67588 22.0251 14.3241 22.0251 18.4246 17.9246C22.5251 13.8241 22.5251 7.17588 18.4246 3.07538C14.3241 -1.02513 7.67588 -1.02513 3.57538 3.07538C-0.525126 7.17588 -0.525126 13.8241 3.57538 17.9246Z"
								fill="var(--mainTextColor)"
							/>
							<path d="M10.5097 4.9841L16.1774 10.6517L15.0061 11.8231L9.3384 6.15541L10.5097 4.9841Z" fill="var(--mainTextColor)" />
							<path d="M16.1772 10.6516L10.5096 16.3193L9.33828 15.148L15.0059 9.48031L16.1772 10.6516Z" fill="var(--mainTextColor)" />
							<path d="M14.9709 11.3277H1.42474V9.6712H14.9709V11.3277Z" fill="var(--mainTextColor)" />
						</svg>
					</div>
				</div>
			</LinkWithPreloader>
		</div>
	);
};

export default function ClientComponent({ language }: { language: string }) {
	useScreenScroll(styles);
	useScreenInit();
	useDetectMobile();
	const { setPageState } = usePreloaderStore();
	const { isTopBannerActive, visibleMobileFilters, setVisibleMobileFilters } = useHudMenuStore();
	const { scrollAllowed, setScrollAllowed } = useScrollStore();
	const { windowWidth, readyCheck, setReadyCheck } = useWindowStore();
	const { isMobile } = useWindowStore();
	const [isResetButtonActive, setIsResetButtonActive] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);
	const categoriesFilterRef = useRef<HTMLDivElement>(null);

	// Состояние для хранения выбранной категории
	const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

	// Получаем данные из хранилища статей
	const { articlesList, allArticlesFetchFinished, fetchAllArticles, categories, categoriesFetchFinished, fetchCategories } = useAllArticlesStore();
	const { data, mediaPageFetchingFinished, fetchData } = useMediaPageStore();

	// Фильтруем статьи по выбранной категории
	const filteredArticles = selectedCategory
		? articlesList.filter((article) => article.article_category?.includes(selectedCategory) || article.categories?.includes(selectedCategory))
		: articlesList;

	// Используем хук для проверки готовности страницы
	// Передаем массив зависимостей, которые должны быть загружены
	const pageReady = usePageReady([articlesList, categories], containerRef);

	useEffect(() => {
		// Загружаем статьи и категории при монтировании компонента
		fetchData(language);
		fetchAllArticles(language);
		fetchCategories(language);
		document.querySelector("body")?.classList.add("media");

		return () => {
			document.querySelector("body")?.classList.remove("media");
			setVisibleMobileFilters(false);
		};
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

	// Обработчик изменения категории
	const handleCategoryChange = (categoryId: number | null) => {
		setSelectedCategory(categoryId);
	};

	useEffect(() => {
		if (data?.page_main_settings?.background_color) {
			// Устанавливаем CSS переменную --backgroundColor в :root
			document.documentElement.style.setProperty("--backgroundColor", data.page_main_settings.background_color);
			document.documentElement.style.setProperty("--backgroundColorTransparent", data.page_main_settings.background_color + "40");
		} else {
			// Если данные еще не загружены, устанавливаем fallback значение
			document.documentElement.style.setProperty("--backgroundColor", "#353c94");
			document.documentElement.style.setProperty("--backgroundColorTransparent", "#353c9440");
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

		setReadyCheck(!readyCheck);

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
			<div ref={containerRef} className={`screenScroll simpleScroll articles ${styles.screenScroll} ${styles.articlesScroll}`}>
				<div
					className={`screen active ${styles.screen}`}
					data-screen-lightness={data?.page_main_settings?.text_is_light ? "dark" : "light"}
					// data-screen-lightness={"dark"}
					data-lines-index={0}
					data-mini-line-rotation={-45}
					data-position-x={50}
					data-position-y={50}
					data-vertical-y={50}
					data-horizontal-x={50}
					data-horizontal-width={20}
					data-vertical-height={100}
					data-lines-color={"light"}
					data-left-line-x={windowWidth > 980 ? (windowWidth > 1280 ? 0 : 10) : 0}
					data-left-line-height={windowWidth > 980 ? 75 : 0}
					data-right-line-x={windowWidth > 980 ? (windowWidth > 1280 ? 100 : 90) : 100}
					data-right-line-height={windowWidth > 980 ? 75 : 0}
					data-lines-opacity={windowWidth > 640 ? 1 : 0}
				>
					<div className={`screenContent ${styles.screenContent} ${isTopBannerActive ? styles.withTopBanner : ""}`}>
						{/* Фильтр по категориям */}
						<div className={`${styles.categoriesFilter} ${visibleMobileFilters ? styles.active : ""}`} ref={categoriesFilterRef}>
							<div className={styles.screenTitle}>{language === "ru" ? "Медиа" : "Media"}</div>
							<div className={styles.mobileFilter}>
								<div
									className={styles.filterButton}
									onClick={() => {
										setVisibleMobileFilters(!visibleMobileFilters);
									}}
								>
									<div className={styles.icon}>
										<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
											<path d="M11.5 4H13.5" stroke="var(--mainTextColor)" strokeLinecap="square" strokeLinejoin="round" />
											<path d="M11.5 12H13.5" stroke="var(--mainTextColor)" strokeLinecap="square" strokeLinejoin="round" />
											<path d="M2.5 4H9.5" stroke="var(--mainTextColor)" strokeLinecap="square" strokeLinejoin="round" />
											<path d="M2.5 12H9.5" stroke="var(--mainTextColor)" strokeLinecap="square" strokeLinejoin="round" />
											<path d="M7.5 8H13.5" stroke="var(--mainTextColor)" strokeLinecap="square" strokeLinejoin="round" />
											<path d="M2.5 8H5.5" stroke="var(--mainTextColor)" strokeLinecap="square" strokeLinejoin="round" />
											<path d="M9.5 3V5" stroke="var(--mainTextColor)" strokeLinecap="square" strokeLinejoin="round" />
											<path d="M9.5 11V13" stroke="var(--mainTextColor)" strokeLinecap="square" strokeLinejoin="round" />
											<path d="M5.5 7V9" stroke="var(--mainTextColor)" strokeLinecap="square" strokeLinejoin="round" />
										</svg>
									</div>
									<div className={styles.text}>
										{!visibleMobileFilters ? (language === "ru" ? "Фильтры" : "Filters") : language === "ru" ? "Фильтры" : "Filters"}
									</div>
								</div>
							</div>
							<div className={`${styles.filterBlock}`}>
								<div className={styles.filter}>
									<div className={styles.filterNameBlock}>
										<div className={styles.icon}>
											<svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
												<path
													fillRule="evenodd"
													clipRule="evenodd"
													d="M7.99805 15.2379C11.7193 15.2379 14.736 12.2212 14.736 8.5C14.736 4.77875 11.7193 1.76209 7.99805 1.76209C4.2768 1.76209 1.26013 4.77875 1.26013 8.5C1.26013 12.2212 4.2768 15.2379 7.99805 15.2379ZM7.99805 16.5C12.4163 16.5 15.998 12.9183 15.998 8.5C15.998 4.08172 12.4163 0.5 7.99805 0.5C3.57977 0.5 -0.00195312 4.08172 -0.00195312 8.5C-0.00195313 12.9183 3.57977 16.5 7.99805 16.5Z"
													fill="var(--mainTextColor)"
												/>
												<path
													fillRule="evenodd"
													clipRule="evenodd"
													d="M6.87399 3.34939C6.3661 4.60947 6.02347 6.43699 6.02347 8.52003C6.02347 10.6031 6.3661 12.4306 6.87399 13.6907C7.12929 14.3241 7.4016 14.7524 7.63941 15.0019C7.75476 15.123 7.84458 15.1837 7.90081 15.2122C7.95099 15.2377 7.97341 15.2376 7.97744 15.2376C7.98148 15.2376 8.00434 15.2377 8.05453 15.2122C8.11075 15.1837 8.20057 15.123 8.31592 15.0019C8.55373 14.7524 8.82605 14.3241 9.08135 13.6907C9.58923 12.4306 9.93187 10.6031 9.93187 8.52003C9.93187 6.43699 9.58924 4.60947 9.08135 3.34939C8.82605 2.71599 8.55373 2.28769 8.31592 2.03814C8.20057 1.9171 8.11075 1.85641 8.05453 1.82787C8.00434 1.80239 7.98192 1.80246 7.97789 1.80248C7.97386 1.80246 7.95099 1.80239 7.90081 1.82787C7.84459 1.85641 7.75476 1.9171 7.63941 2.03814C7.4016 2.28769 7.12929 2.71599 6.87399 3.34939ZM7.97767 0.540391C6.20136 0.540391 4.76138 4.113 4.76138 8.52003C4.76138 12.9271 6.20136 16.4997 7.97767 16.4997C9.75397 16.4997 11.194 12.9271 11.194 8.52003C11.194 4.113 9.75397 0.540391 7.97767 0.540391Z"
													fill="var(--mainTextColor)"
												/>
												<path d="M0.527118 7.86887H15.5093V9.13096H0.527118V7.86887Z" fill="var(--mainTextColor)" />
											</svg>
										</div>
										<div className={styles.name}>{language === "ru" ? "Рубрикатор" : "Category"}</div>
									</div>
									<div className={styles.filterValues}>
										{categories.map((category) => (
											<div
												key={category.id}
												className={`${styles.value} ${selectedCategory === category.id ? styles.active : ""}`}
												onClick={() => handleCategoryChange(category.id)}
											>
												{category.name}
											</div>
										))}
									</div>
								</div>
								<div className={`${styles.resetFilterButton} ${selectedCategory === null ? styles.disabled : ""}`} onClick={() => handleCategoryChange(null)}>
									{language === "ru" ? "Сбросить" : "Reset"}
								</div>
								<div className={styles.mobileButtonsBlock}>
									<div
										className={`${styles.button} ${styles.resetButton} ${isResetButtonActive ? styles.active : styles.inactive}`}
										onClick={() => handleCategoryChange(null)}
									>
										<div className={styles.text}>{language === "ru" ? "Сбросить" : "Reset"}</div>
										<div className={styles.icon}>
											<svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
												<path d="M12.0019 1H1V12H1.00194H12.0019V1Z" stroke="var(--mainTextColor)" strokeLinecap="square" />
												<path d="M8.5 4.5L4.5 8.5" stroke="var(--mainTextColor)" strokeLinecap="square" />
												<path d="M4.5 4.5L8.5 8.5" stroke="var(--mainTextColor)" strokeLinecap="square" />
											</svg>
										</div>
									</div>
									<div
										className={`${styles.button} ${styles.acceptButton}`}
										onClick={() => {
											setVisibleMobileFilters(false);
										}}
									>
										<div className={styles.text}>{language === "ru" ? "Применить" : "Apply"}</div>
									</div>
								</div>
							</div>
						</div>

						{/* Отображение списка статей */}
						{allArticlesFetchFinished ? (
							<div className={styles.articlesList}>
								{filteredArticles.length > 0 ? (
									filteredArticles.map((article) => {
										return <ArticleCard key={article.id} article={article} language={language} />;
									})
								) : (
									<div className={styles.noArticles}>{language === "ru" ? "Статьи не найдены" : "No articles found"}</div>
								)}
							</div>
						) : (
							<div className={styles.loading}>{language === "ru" ? "Загрузка..." : "Loading..."}</div>
						)}
					</div>
				</div>
			</div>
		</>
	);
}
