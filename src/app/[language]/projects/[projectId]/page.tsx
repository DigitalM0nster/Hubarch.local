// src/app/[language]/projects/[projectId]/page.tsx

import { Metadata, ResolvingMetadata } from "next";
import ProjectIdPage from "./ProjectIdPage";
import { getProjectData } from "./getProjectData";

// Отключаем кеширование для метаданных
export const revalidate = 0;
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ language: string; projectId: string }> }, parent: ResolvingMetadata): Promise<Metadata> {
	const { language, projectId } = await params;
	const projectData = await getProjectData(language, projectId);
	const previousImages = (await parent).openGraph?.images || [];

	if (!projectData) {
		return {
			title: language === "ru" ? "Проект не найден" : "Project not found",
		};
	}

	const title = projectData.title || `${language === "ru" ? "Проект" : "Project"} ${projectId}`;
	const description = projectData.description || "";

	return {
		title,
		description,
		openGraph: {
			title,
			description,
			images: projectData.images?.length ? [{ url: projectData.images[0], alt: title }] : previousImages,
		},
	};
}

// Компонент страницы теперь просто передает параметры в клиентский компонент
export default async function ProjectId({ params }: { params: Promise<{ language: string; projectId: string }> }) {
	const { language, projectId } = await params;

	// Получаем начальные данные для гидрации
	const initialData = await getProjectData(language, projectId);

	// Передаем всё в клиентский компонент
	return <ProjectIdPage language={language} projectId={projectId} initialData={initialData} />;
}
