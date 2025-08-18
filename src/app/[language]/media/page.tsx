// src\app\[language]\services\page.tsx

import type { Metadata } from "next";
import ClientComponent from "./components/ClientComponent";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export function generateStaticParams() {
	return [{ language: "ru" }, { language: "en" }]; // Доступные языки
}

export const metadata: Metadata = {
	title: "Hubarch - Новости и статьи | Архитектура и дизайн интерьеров",
	description: "Читайте последние новости и статьи о проектах Hubarch. Интересные материалы об архитектуре, дизайне интерьеров и современных решениях в области проектирования.",
	openGraph: {
		title: "Hubarch - Новости и статьи | Архитектура и дизайн интерьеров",
		description:
			"Читайте последние новости и статьи о проектах Hubarch. Интересные материалы об архитектуре, дизайне интерьеров и современных решениях в области проектирования.",
		url: `${siteUrl}/media`, // Динамически подставляем домен
		images: [
			{
				url: `${siteUrl}/images/media/article_placeholder.png`, // Динамический URL для картинки статей
				width: 1200,
				height: 630,
			},
		],
		type: "website",
	},
};

export default async function Media({ params }: { params: Promise<{ language: string }> }) {
	const resolvedParams = await params;
	const language = resolvedParams.language;

	return <ClientComponent language={language} />;
}
