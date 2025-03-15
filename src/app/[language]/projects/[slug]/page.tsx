import { notFound } from "next/navigation";

export async function generateStaticParams() {
	try {
		const res = await fetch(`${process.env.NEXT_PUBLIC_WP_API}/projects`);
		if (!res.ok) throw new Error("Ошибка при получении списка проектов");
		const projects = await res.json();

		return projects.map((project: any) => ({
			slug: project.slug,
		}));
	} catch (error) {
		console.error("Ошибка загрузки проектов:", error);
		return [];
	}
}

export default async function ProjectPage({ params }: { params: { slug: string } }) {
	try {
		const res = await fetch(`${process.env.NEXT_PUBLIC_WP_API}/projects?slug=${params.slug}`, {
			next: { revalidate: 3600 }, // ISR: обновление кэша каждые 3600 секунд
		});
		if (!res.ok) throw new Error("Ошибка при загрузке проекта");

		const projects = await res.json();
		if (!projects.length) notFound();

		const project = projects[0];

		return (
			<div>
				<h1>{project.title.rendered}</h1>
				<p>{project.acf?.description || "Описание отсутствует"}</p>
				{project.acf?.image_url && <img src={project.acf.image_url} alt={project.title.rendered} />}
			</div>
		);
	} catch (error) {
		console.error("Ошибка загрузки проекта:", error);
		notFound();
	}
}
