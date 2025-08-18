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
	title: "Hubarch - Услуги | FAQ и тест-фит проектирования",
	description:
		"Ответы на частые вопросы о наших услугах. Тест-фит планировочных решений от 20 000 ₽. Архитектурные и интерьерные проекты для коммерческих и общественных пространств.",
	openGraph: {
		title: "Hubarch - Услуги | FAQ и тест-фит проектирования",
		description:
			"Ответы на частые вопросы о наших услугах. Тест-фит планировочных решений от 20 000 ₽. Архитектурные и интерьерные проекты для коммерческих и общественных пространств.",
		url: `${siteUrl}/services`, // Динамически подставляем домен
		images: [
			{
				url: `${siteUrl}/images/services/iconA.png`, // Динамический URL для картинки услуг
				width: 1200,
				height: 630,
			},
		],
		type: "website",
	},
};

export default async function Services({ params }: { params: Promise<{ language: string }> }) {
	const { language } = await params;
	// const pageData = await getServicesPageData(language);

	return <ClientComponent language={language} />;
}
