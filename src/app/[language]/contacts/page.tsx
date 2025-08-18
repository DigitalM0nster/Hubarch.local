// src\app\[language]\contacts\page.tsx

import type { Metadata } from "next";
import ClientComponent from "./components/ClientComponent";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export function generateStaticParams() {
	return [{ language: "ru" }, { language: "en" }]; // Доступные языки
}

export const metadata: Metadata = {
	title: "Hubarch - Контакты | Связаться с нами",
	description: "Свяжитесь с Hubarch для обсуждения вашего проекта. Контактная информация, адреса офисов на карте и форма заявки для архитектурных и интерьерных проектов.",
	openGraph: {
		title: "Hubarch - Контакты | Связаться с нами",
		description: "Свяжитесь с Hubarch для обсуждения вашего проекта. Контактная информация, адреса офисов на карте и форма заявки для архитектурных и интерьерных проектов.",
		url: `${siteUrl}/contacts`, // Динамически подставляем домен
		images: [
			{
				url: `${siteUrl}/images/contactUsIcon.svg`, // Динамический URL для картинки контактов
				width: 1200,
				height: 630,
			},
		],
		type: "website",
	},
};

export default async function Contacts({ params }: { params: Promise<{ language: string }> }) {
	const { language } = await params;
	// const pageData = await getServicesPageData(language);

	return (
		<>
			<ClientComponent language={language} />
		</>
	);
}
