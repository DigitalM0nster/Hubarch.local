// src\app\[language]\services\page.tsx

import type { Metadata } from "next";
import ClientComponent from "./components/ClientComponent";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export function generateStaticParams() {
	return [{ language: "ru" }, { language: "en" }]; // Доступные языки
}

export const metadata: Metadata = {
	title: "Hubarch - контакты",
	description: "Описание страницы контакты",
	openGraph: {
		title: "Hubarch - контакты",
		description: "Описание страницы контакты",
		url: `${siteUrl}/contacts`, // Динамически подставляем домен
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

export default async function Services({ params }: { params: Promise<{ language: string }> }) {
	const { language } = await params;
	// const pageData = await getServicesPageData(language);

	return (
		<>
			<div className="screenScroll simpleScroll">
				<ClientComponent language={language} />
			</div>
		</>
	);
}
