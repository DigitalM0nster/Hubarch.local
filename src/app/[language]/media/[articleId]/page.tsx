import { notFound } from "next/navigation";

export async function generateStaticParams() {
	try {
		const res = await fetch(`${process.env.NEXT_PUBLIC_WP_API}/media`);
		const posts = await res.json();

		// допустим в твоём проекте доступны только ru и en
		const languages = ["ru", "en"];

		// создаём маршруты для каждой статьи и каждого языка
		const staticParams = [];

		for (const lang of languages) {
			for (const post of posts) {
				staticParams.push({
					language: lang,
					articleId: post.slug,
				});
			}
		}

		return staticParams;
	} catch (e) {
		console.error("Ошибка загрузки статей:", e);
		return [];
	}
}

export default async function ArticlePage(props: { params: Promise<{ language: string; articleId: string }> }) {
	const { language, articleId } = await props.params;

	try {
		const res = await fetch(`${process.env.NEXT_PUBLIC_WP_API}/media?slug=${articleId}`, {
			next: { revalidate: 3600 },
		});
		if (!res.ok) throw new Error("Ошибка при загрузке статьи");

		const mediaNews = await res.json();
		if (!mediaNews.length) notFound();

		const mediaNewItem = mediaNews[0];

		return (
			<div>
				<h1>{mediaNewItem.title.rendered}</h1>
				<p>{mediaNewItem.acf?.description || language === "ru" ? "Описание отсутствует" : "No description"}</p>
				{/* {mediaNewItem.acf?.image_url && <img src={mediaNewItem.acf.image_url} alt={mediaNewItem.title.rendered} />} */}
			</div>
		);
	} catch (error) {
		console.error("Ошибка загрузки статьи:", error);
		notFound();
	}
}
