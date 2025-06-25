// src\app\[language]\services\page.tsx

import type { Metadata } from "next";
import ClientComponent from "./components/ClientComponent";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export function generateStaticParams() {
	return [{ language: "ru" }, { language: "en" }]; // Доступные языки
}

export const metadata: Metadata = {
	title: "Hubarch - Медиа",
	description: "Описание страницы медиа",
	openGraph: {
		title: "Hubarch - медиа",
		description: "Описание страницы медиа",
		url: `${siteUrl}/media`, // Динамически подставляем домен
		images: [
			{
				url: `${siteUrl}/images/about-us.jpg`, // Динамический URL для картинки
				width: 1200,
				height: 630,
			},
		],
		type: "article",
	},
};

export default async function Media({ params }: { params: Promise<{ language: string }> }) {
	const resolvedParams = await params;
	const language = resolvedParams.language;

	return <ClientComponent language={language} />;
}
