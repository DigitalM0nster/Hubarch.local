// src/app/[language]/projects/[projectId]/page.tsx

import { Metadata, ResolvingMetadata } from "next";
import https from "https";
import ProjectIdPage from "./ProjectIdPage";

// ⛔️ Временно отключаем SSL-проверку во всей Node-среде
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// Типы для параметров
type Props = {
	params: Promise<{ language: string; projectId: string }>;
	searchParams: { [key: string]: string | string[] | undefined };
};

interface Project {
	id: number;
	lang: string;
	slug: string;
	acf: any;
	[otherProps: string]: any;
}

interface Award {
	id: number;
	name: string;
	slug: string;
	acf: any;
}

export async function getProjectData(language: string, projectId: string) {
	const API_URL = process.env.NEXT_PUBLIC_WP_API;
	if (!API_URL) throw new Error("NEXT_PUBLIC_WP_API не задан");

	const agent = new https.Agent({ rejectUnauthorized: false });

	try {
		// Загружаем все проекты (так же, как в сторе)
		const projectsRes = await fetch(`${API_URL}/projects?per_page=100&_embed`, {
			next: { revalidate: 3600 },
			agent,
			headers: { Accept: "application/json" },
		});
		const projects: Project[] = await projectsRes.json();

		// Ищем нужный проект по slug и языку
		const foundProject = projects.find((p) => p.slug === projectId && p.lang === language);
		if (!foundProject) return null;

		// Загружаем все премии
		const awardsRes = await fetch(`${API_URL}/awards?per_page=100&_fields=id,name,slug,acf`, {
			next: { revalidate: 3600 },
			agent,
			headers: { Accept: "application/json" },
		});
		const allAwards: Award[] = await awardsRes.json();

		// Обогащаем данные проекта премиями (как в сторе)
		const awards = foundProject.acf?.project_awards || [];

		// Заменяем каждую entry.award на чистый объект без title
		const updatedAwards = awards
			.map((entry: any) => {
				const award = entry.award;
				if (!award?.title || !award.year) return null;

				const term = award.title;
				const fullAward = allAwards.find((a) => a.id === term.term_id);
				if (!fullAward) return null;

				return {
					term_id: term.term_id,
					name: term.name,
					slug: term.slug,
					acf: fullAward.acf || {},
					year: award.year,
					nominations: award.nominations || [],
				};
			})
			.filter(Boolean);

		foundProject.acf.project_awards = updatedAwards;

		return foundProject;
	} catch (error) {
		console.error("Ошибка при получении projectData:", error);
		return null;
	}
}

// Функция генерации метаданных страницы
export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
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

// Статические языковые параметры
export function generateStaticParams() {
	return [{ language: "ru" }, { language: "en" }];
}

// Основной компонент страницы
export default async function ProjectId({ params }: { params: Promise<{ language: string; projectId: string }> }) {
	const { language, projectId } = await params;

	const projectData = await getProjectData(language, projectId);
	return (
		<>
			<ProjectIdPage language={language} projectId={projectId} projectData={projectData} />
		</>
	);
}
