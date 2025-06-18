// src\app\[language]\services\page.tsx

import type { Metadata } from "next";
import ClientComponent from "./components/ClientComponent";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export function generateStaticParams() {
	return [{ language: "ru" }, { language: "en" }]; // Доступные языки
}

export const metadata: Metadata = {
	title: "Hubarch - О нас",
	description: "Описание страницы О нас",
	openGraph: {
		title: "Hubarch - О нас",
		description: "Описание страницы О нас",
		url: `${siteUrl}/about`, // Динамически подставляем домен
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

export default async function About({ params }: { params: Promise<{ language: string }> }) {
	const { language } = await params;
	// const pageData = await getServicesPageData(language);

	return (
		<>
			<ClientComponent language={language} />
		</>
	);
}
