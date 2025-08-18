// src\app\[language]\services\page.tsx

import type { Metadata } from "next";
import ClientComponent from "./components/ClientComponent";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export function generateStaticParams() {
	return [{ language: "ru" }, { language: "en" }]; // Доступные языки
}

export const metadata: Metadata = {
	title: "Hubarch - О нас | Архитектурная студия с 2013 года",
	description: "Узнайте о команде Hubarch - архитектурной студии с 11-летним опытом. История развития, команда профессионалов, награды и проекты площадью более 238 000 м².",
	openGraph: {
		title: "Hubarch - О нас | Архитектурная студия с 2013 года",
		description: "Узнайте о команде Hubarch - архитектурной студии с 11-летним опытом. История развития, команда профессионалов, награды и проекты площадью более 238 000 м².",
		url: `${siteUrl}/about`, // Динамически подставляем домен
		images: [
			{
				url: `${siteUrl}/images/about/DashaGubarevich.png`, // Динамический URL для картинки команды
				width: 1200,
				height: 630,
			},
		],
		type: "website",
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
