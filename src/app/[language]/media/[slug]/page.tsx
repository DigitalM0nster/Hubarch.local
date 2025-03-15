import { notFound } from "next/navigation";

export async function generateStaticParams() {
	try {
		const res = await fetch(`${process.env.NEXT_PUBLIC_WP_API}/media`);
		if (!res.ok) throw new Error("Ошибка при получении списка статьей");
		const projects = await res.json();

		return projects.map((project: any) => ({
			slug: project.slug,
		}));
	} catch (error) {
		console.error("Ошибка загрузки статьей:", error);
		return [];
	}
}

export default async function ProjectPage({ params }: { params: { slug: string } }) {
	try {
		const res = await fetch(`${process.env.NEXT_PUBLIC_WP_API}/media?slug=${params.slug}`, {
			next: { revalidate: 3600 }, // ISR: обновление кэша каждые 3600 секунд
		});
		if (!res.ok) throw new Error("Ошибка при загрузке статьи");

		const mediaNews = await res.json();
		if (!mediaNews.length) notFound();

		const mediaNewItem = mediaNews[0];

		return (
			<div>
				<h1>{mediaNewItem.title.rendered}</h1>
				<p>{mediaNewItem.acf?.description || "Описание отсутствует"}</p>
				{mediaNewItem.acf?.image_url && <img src={mediaNewItem.acf.image_url} alt={mediaNewItem.title.rendered} />}
			</div>
		);
	} catch (error) {
		console.error("Ошибка загрузки статьи:", error);
		notFound();
	}
}
