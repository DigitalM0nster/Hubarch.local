// src\app\[language]\projects\[projectId]\getProjectData.ts

export interface ArticleBlockData {
	acf_fc_layout: "one_block" | "two_blocks";
	center_block?: BlockTypeData[] | false;
	left_block?: BlockTypeData[] | false;
	right_block?: BlockTypeData[] | false;
}
export interface BlockTypeData {
	acf_fc_layout: "image_block" | "quote_block" | "link_block" | "list_block" | "text_block";
	image: string | false;
	author: string;
	position: string;
	text: string;
	link: string;
	list:
		| {
				list_li: string;
		  }[]
		| false;
	title?: string;
}
export interface ArticleData {
	id: number;
	lang: string;
	slug: string;
	acf: {
		article_blocks: ArticleBlockData[] | false;
		description: string;
		image: string | false;
		quote: {
			author: string;
			text: string;
		};
	};
	[otherProps: string]: any;
}

export async function getArticleData(language: string, articleId: string) {
	const API_URL = process.env.NEXT_PUBLIC_WP_API;
	process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

	if (!API_URL) throw new Error("NEXT_PUBLIC_WP_API не задан");

	try {
		const articlesRes = await fetch(`${API_URL}/articles?per_page=100&_embed`, {
			cache: "no-store",
			headers: { Accept: "application/json" },
		});
		const articles: ArticleData[] = await articlesRes.json();

		const foundProject = articles.find((p) => p.slug === articleId && p.lang === language);
		if (!foundProject) return null;

		return foundProject;
	} catch (error) {
		console.error("Ошибка при получении articleData:", error);
		return null;
	}
}
