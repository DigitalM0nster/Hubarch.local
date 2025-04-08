// src\app\[language]\projects\page.tsx

import ProjectsPageClient from "@/components/pages/projects/ProjectsPageClient";

export function generateStaticParams() {
	return [{ language: "ru" }, { language: "en" }]; // Доступные языки
}

export default async function Projects(props: unknown) {
	const { language } = (props as { params: { language: string } }).params;

	return <ProjectsPageClient language={language} />;
}
