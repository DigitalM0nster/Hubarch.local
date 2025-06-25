import { create } from "zustand";

export interface Article {
	id: number;
	title: {
		rendered: string;
	};
	slug: string;
	link: string;
	acf: {
		image: string | false;
		description?: string;
		article_blocks: string | null;
	};
	article_category: number[];
	categories: number[];
	lang: string;
	date: string;
	_embedded?: {
		"wp:featuredmedia"?: Array<{
			source_url: string;
		}>;
	};
}

interface AllArticlesStore {
	articlesList: Article[];
	allArticlesFetchFinished: boolean;
	categories: { id: number; name: string; slug: string }[];
	categoriesFetchFinished: boolean;
	fetchAllArticles: (language: string) => Promise<void>;
	fetchCategories: (language: string) => Promise<void>;
}

export const useAllArticlesStore = create<AllArticlesStore>((set) => ({
	articlesList: [],
	allArticlesFetchFinished: false,
	categories: [],
	categoriesFetchFinished: false,
	fetchAllArticles: async (language) => {
		set({ allArticlesFetchFinished: false });
		const API_URL = process.env.NEXT_PUBLIC_WP_API;
		if (!API_URL) {
			throw new Error("API_URL не задан в .env файле");
		}
		try {
			const response = await fetch(`${API_URL}/articles?per_page=100&_embed&lang=${language}`);
			const data = await response.json();
			set({ articlesList: data });
		} catch (error) {
			console.error("Ошибка при загрузке статей:", error);
		} finally {
			set({ allArticlesFetchFinished: true });
		}
	},
	fetchCategories: async (language) => {
		set({ categoriesFetchFinished: false });
		const API_URL = process.env.NEXT_PUBLIC_WP_API;
		if (!API_URL) {
			throw new Error("API_URL не задан в .env файле");
		}
		try {
			const response = await fetch(`${API_URL}/article_category?per_page=100&lang=${language}`);
			const data = await response.json();
			set({ categories: data });
		} catch (error) {
			console.error("Ошибка при загрузке категорий статей:", error);
		} finally {
			set({ categoriesFetchFinished: true });
		}
	},
}));
