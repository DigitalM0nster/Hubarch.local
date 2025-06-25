"use client";

import { useDetectMobile } from "@/hooks/useDetectMobile";
import { useScreenInit } from "@/hooks/useScreenInit";
import { useScreenScroll } from "@/hooks/useScreenScroll";
import { usePreloaderStore } from "@/store/preloaderStore";
import { useScrollStore } from "@/store/scrollStore";
import { useWindowStore } from "@/store/windowStore";
import { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import { Article, useAllArticlesStore } from "@/store/allArticlesStore";
import Link from "next/link";
import parse from "html-react-parser";
import LinkWithPreloader from "@/components/preloader/LinkWithPreloader";

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
					<div className={styles.icon} />
				</div>
			</LinkWithPreloader>
		</div>
	);
};

export default function ClientComponent({ language }: { language: string }) {
	useScreenScroll(styles);
	useScreenInit();
	useDetectMobile();
	const { setTotal, markReady } = usePreloaderStore();
	const { scrollAllowed } = useScrollStore();
	const { windowWidth } = useWindowStore();
	const { isMobile } = useWindowStore();
	const [visibleMobileFilters, setVisibleMobileFilters] = useState(false);
	const [isResetButtonActive, setIsResetButtonActive] = useState(false);

	// Состояние для хранения выбранной категории
	const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

	// Получаем данные из хранилища статей
	const { articlesList, allArticlesFetchFinished, fetchAllArticles, categories, categoriesFetchFinished, fetchCategories } = useAllArticlesStore();

	// Фильтруем статьи по выбранной категории
	const filteredArticles = selectedCategory
		? articlesList.filter((article) => article.article_category?.includes(selectedCategory) || article.categories?.includes(selectedCategory))
		: articlesList;

	useEffect(() => {
		// Загружаем статьи и категории при монтировании компонента
		fetchAllArticles(language);
		fetchCategories(language);
		setTotal(0);
		markReady();
		document.querySelector("body")?.classList.add("blue");

		return () => {
			document.querySelector("body")?.classList.remove("blue");
		};
	}, [language]);

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

	return (
		<>
			<div className={`screenScroll simpleScroll articles ${styles.screenScroll} ${styles.articlesScroll}`}>
				<div
					className={`screen active ${styles.screen}`}
					data-screen-lightness="dark"
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
					<div className={`screenContent ${styles.screenContent}`}>
						{/* Фильтр по категориям */}
						<div className={`${styles.categoriesFilter} ${visibleMobileFilters ? styles.active : ""}`}>
							<div className={styles.screenTitle}>{language === "ru" ? "Медиа" : "Media"}</div>
							<div className={styles.mobileFilter}>
								<div
									className={styles.filterButton}
									onClick={() => {
										setVisibleMobileFilters(!visibleMobileFilters);
									}}
								>
									<div className={styles.icon} />
									<div className={styles.text}>
										{!visibleMobileFilters ? (language === "ru" ? "Фильтры" : "Filters") : language === "ru" ? "Фильтры" : "Filters"}
									</div>
								</div>
							</div>
							<div className={`${styles.filterBlock}`}>
								<div className={styles.filter}>
									<div className={styles.filterNameBlock}>
										<div className={styles.icon}>
											<img src="/images/media/filter_icon.svg" alt="" />
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
							</div>
							<div className={styles.mobileButtonsBlock}>
								<div
									className={`${styles.button} ${styles.resetButton} ${isResetButtonActive ? styles.active : styles.inactive}`}
									onClick={() => handleCategoryChange(null)}
								>
									<div className={styles.text}>{language === "ru" ? "Сбросить" : "Reset"}</div>
									<div className={styles.icon} />
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
