// src/app/[language]/projects/[projectId]/page.tsx

import { Metadata, ResolvingMetadata } from "next";
import ProjectIdPage from "./ProjectIdPage";
import { getProjectData } from "@/lib/getProjectData";

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

export function generateStaticParams() {
	return [{ language: "ru" }, { language: "en" }];
}

export default async function ProjectId({ params }: { params: Promise<{ language: string; projectId: string }> }) {
	const { language, projectId } = await params;

	const projectData = await getProjectData(language, projectId);
	return <ProjectIdPage language={language} projectId={projectId} projectData={projectData} />;
}
