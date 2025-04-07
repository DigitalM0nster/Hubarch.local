// src/app/[language]/projects/[projectId]/page.tsx

import { notFound } from "next/navigation";

type Props = {
	params: {
		language: string;
		projectId: string;
	};
};

export default async function ProjectPage({ params }: Props) {
	const { language, projectId } = params;

	// 🔥 Fetch по slug проекта, с языком
	const res = await fetch(`http://admin.hubarch.local/wp-json/wp/v2/projects?slug=${projectId}&lang=${language}`, {
		next: { revalidate: 60 }, // или { cache: 'no-store' }
	});

	const data = await res.json();

	if (!data || !data.length) return notFound();

	const projectData = data[0]; // т.к. slug уникальный, всегда 1

	return (
		<main>
			<h1>{projectData.title.rendered}</h1>
			<div dangerouslySetInnerHTML={{ __html: projectData.content.rendered }} />
		</main>
	);
}
