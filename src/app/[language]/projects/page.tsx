// src\app\[language]\projects\page.tsx
import type { Metadata } from "next";
import ProjectsPageClient from "@/components/pages/projects/ProjectsPageClient";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export function generateStaticParams() {
	return [{ language: "ru" }, { language: "en" }]; // Доступные языки
}

export const metadata: Metadata = {
	title: "Hubarch - Архитектурные и интерьерные проекты | Портфолио",
	description:
		"Изучите наше портфолио архитектурных и интерьерных проектов. Современные решения для жилых и коммерческих пространств. Фильтрация по категориям, типам помещений и площади.",
	openGraph: {
		title: "Hubarch - Архитектурные и интерьерные проекты | Портфолио",
		description:
			"Изучите наше портфолио архитектурных и интерьерных проектов. Современные решения для жилых и коммерческих пространств. Фильтрация по категориям, типам помещений и площади.",
		url: `${siteUrl}/projects`, // Динамически подставляем домен
		images: [
			{
				url: `${siteUrl}/images/projects/placeholder_big.png`, // Динамический URL для картинки проектов
				width: 1200,
				height: 630,
			},
		],
		type: "website",
	},
};

export default async function Projects({ params }: { params: Promise<{ language: string; projectId?: string }> }) {
	const { language, projectId } = await params;
	return <ProjectsPageClient language={language} />;
}
