import type { Metadata } from "next";
import { notFound } from "next/navigation";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://hubarch.local";
const wpApi = process.env.NEXT_PUBLIC_WP_API || "http://admin.hubarch.local/wp-json/wp/v2";

type Props = {
	params: Promise<{
		language: string;
		projectId: string;
	}>;
};

// Генерация мета-данных для SEO
export async function generateMetadata(props: Props): Promise<Metadata> {
    const params = await props.params;
    const { language, projectId } = params;

    const res = await fetch(`${wpApi}/projects?slug=${projectId}&lang=${language}`, { cache: "no-store" });
    const data = await res.json();

    if (!data || !data.length) return {};

    const project = data[0];

    const title = project.yoast_head_json?.title || project.title.rendered;
    const description = project.yoast_head_json?.description || "";
    const ogImage = project.yoast_head_json?.og_image?.[0]?.url || `${siteUrl}/images/og-default.jpg`;

    return {
		title,
		description,
		openGraph: {
			title,
			description,
			url: `${siteUrl}/${language}/projects/${project.slug}`,
			images: [
				{
					url: ogImage,
					width: 1200,
					height: 630,
				},
			],
			type: "article",
		},
	};
}

// Страница конкретного проекта
export default async function ProjectPage(props: Props) {
    const params = await props.params;
    const { language, projectId } = params;

    const res = await fetch(`${wpApi}/projects?slug=${projectId}&lang=${language}`, {
		next: { revalidate: 60 }, // ISR
	});
    const data = await res.json();

    if (!data || !data.length) return notFound();

    const project = data[0];

    return (
		<main className="p-4">
			<h1 className="text-2xl font-bold mb-4">{project.title.rendered}</h1>

			{/* Пример клиентского компонента: <ProjectGallery images={project.acf.gallery} /> */}
		</main>
	);
}

// Для SSG: какие маршруты собирать
export async function generateStaticParams() {
	const res = await fetch(`${wpApi}/projects?per_page=100`);
	const projects = await res.json();

	return projects.map((project: any) => ({
		language: project.lang || "ru", // язык проекта от Polylang
		projectId: project.slug,
	}));
}
