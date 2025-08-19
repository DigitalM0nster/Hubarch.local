// src\app\[language]\page.tsx

import type { Metadata } from "next";
import DocumentationPageClient from "./components/DocumentationPageClient";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

type Props = {
	params: Promise<{
		language: string;
	}>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { language } = await params;

	return {
		title: "Hubarch — Архитектурная студия | Дизайн интерьеров и проектирование",
		description:
			"Hubarch - архитектурная студия с 2013 года. Создаем уникальные пространства: архитектурные проекты, дизайн интерьеров, коммерческие пространства. Более 238 000 м² реализованных проектов.",
		openGraph: {
			title: "Hubarch — Архитектурная студия | Дизайн интерьеров и проектирование",
			description:
				"Hubarch - архитектурная студия с 2013 года. Создаем уникальные пространства: архитектурные проекты, дизайн интерьеров, коммерческие пространства. Более 238 000 м² реализованных проектов.",
			url: `${siteUrl}/${language}`,
			images: [
				{
					url: `${siteUrl}/images/hubarch_logo.svg`,
					width: 1200,
					height: 630,
				},
			],
			type: "website",
		},
	};
}

export function generateStaticParams() {
	return [{ language: "ru" }, { language: "en" }];
}

export default async function DocumentationPage({ params }: Props) {
	const { language } = await params;
	return <DocumentationPageClient key={language} language={language} />;
}
