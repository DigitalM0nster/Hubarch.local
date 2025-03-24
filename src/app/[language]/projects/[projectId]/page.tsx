// src/app/[language]/projects/[projectId]/page.tsx
import { notFound } from "next/navigation";

export async function generateStaticParams() {
	try {
		const res = await fetch(`${process.env.NEXT_PUBLIC_WP_API}/projects`);
		const projects = await res.json();

		type Project = {
			slug: string;
		};

		console.log(
			"Загруженные проекты:",
			(projects as Project[]).map((p) => p.slug)
		);

		const languages = ["ru", "en"];
		const staticParams = [];

		for (const lang of languages) {
			for (const project of projects) {
				const slug = typeof project?.slug === "string" ? project.slug.trim() : "";

				if (!slug || slug === "projects") {
					console.warn(`⚠️ Пропущен project со slug: "${project.slug}"`);
					continue;
				}

				console.log(`✅ Добавляем: ${lang}/${slug}`);

				staticParams.push({
					language: lang,
					projectId: slug,
				});
			}
		}

		console.log("Финальные параметры:", staticParams);

		return staticParams;
	} catch (e) {
		console.error("Ошибка загрузки проектов:", e);
		return [];
	}
}

export default async function ProjectPage(props: unknown) {
	const { language, projectId } = (props as { params: { language: string; projectId: string } }).params;

	try {
		const res = await fetch(`${process.env.NEXT_PUBLIC_WP_API}/media?slug=${projectId}`, {
			next: { revalidate: 3600 },
		});
		if (!res.ok) throw new Error("Ошибка при загрузке проекта");

		const projects = await res.json();
		if (!projects.length) notFound();

		const projectItem = projects[0];

		return (
			<div>
				<h1>{projectItem.title.rendered}</h1>
				<p>{projectItem.acf?.description ?? (language === "ru" ? "Описание отсутствует" : "No description")}</p>
			</div>
		);
	} catch (error) {
		console.error("Ошибка загрузки проекта:", error);
		notFound();
	}
}
