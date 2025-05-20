// src\app\[language]\projects\page.tsx

import ProjectsPageClient from "@/components/pages/projects/ProjectsPageClient";

export function generateStaticParams() {
	return [{ language: "ru" }, { language: "en" }]; // Доступные языки
}

export default async function Projects({ params }: { params: Promise<{ language: string; projectId?: string }> }) {
	const { language, projectId } = await params;
	return <ProjectsPageClient language={language} />;
}
