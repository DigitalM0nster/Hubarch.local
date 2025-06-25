// src/app/[language]/projects/[projectId]/page.tsx

import { Metadata, ResolvingMetadata } from "next";
import { getArticleData } from "./getArticleData";
import ArticleIdPage from "./ArticleIdPage";

// Отключаем кеширование полностью
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ language: string; articleId: string }> }, parent: ResolvingMetadata): Promise<Metadata> {
	const { language, articleId } = await params;
	const articleData = await getArticleData(language, articleId);
	const previousImages = (await parent).openGraph?.images || [];

	if (!articleData) {
		return {
			title: language === "ru" ? "Статья не найдена" : "Article not found",
		};
	}

	const title = articleData.title || `${language === "ru" ? "Статья" : "Article"} ${articleId}`;
	const description = articleData.description || "";

	return {
		title,
		description,
		openGraph: {
			title,
			description,
			images: articleData.images?.length ? [{ url: articleData.images[0], alt: title }] : previousImages,
		},
	};
}

export default async function ArticleId({ params }: { params: Promise<{ language: string; articleId: string }> }) {
	const { language, articleId } = await params;

	// Получаем свежие данные при каждом запросе
	const articleData = await getArticleData(language, articleId);

	return <ArticleIdPage language={language} articleId={articleId} articleData={articleData} />;
}
