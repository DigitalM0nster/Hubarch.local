// src\app\[language]\services\page.tsx

import type { Metadata } from "next";
import ClientComponent from "./components/ClientComponent";
import Screen1 from "./components/Screen1";
import Screen2 from "./components/Screen2";
import Screen3 from "./components/Screen3";
import Screen7 from "@/components/pages/mainPage/screen7";
import NextPageServicesScreen from "./components/NextPageServicesScreen";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export function generateStaticParams() {
	return [{ language: "ru" }, { language: "en" }]; // Доступные языки
}

export const metadata: Metadata = {
	title: "Hubarch - услуги",
	description: "Описание страницы услуги",
	openGraph: {
		title: "Hubarch - услуги",
		description: "Описание страницы услуги",
		url: `${siteUrl}/services`, // Динамически подставляем домен
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
				<Screen1 language={language} />
				<Screen2 language={language} />
				<Screen3 language={language} />
				<Screen7 language={language} />
				<NextPageServicesScreen language={language} />
			</div>
		</>
	);
}
