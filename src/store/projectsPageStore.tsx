// src\store\mainPageStore.tsx

import { create } from "zustand";

export interface PageData {
	projects_page: {
		filter_types: {
			icon: string;
			title: string;
		};
		filter_footage: {
			icon: string;
			title: string;
		};
	};
}

export interface ProjectsPageStore {
	data: PageData | null;
	projectsPageFetchFinished: boolean;
	error: string | null;
	fetchData: (language: string) => Promise<void>;
}

export const useProjectsPageStore = create<ProjectsPageStore>((set) => ({
	data: null,
	projectsPageFetchFinished: false,
	error: null,
	fetchData: async (language) => {
		set({ projectsPageFetchFinished: false, error: null });

		const API_URL = process.env.NEXT_PUBLIC_WP_API;
		if (!API_URL) {
			throw new Error("API_URL не задан в .env файле");
		}

		const slug = "projects";

		try {
			const res = await fetch(`${API_URL}/pages?slug=${slug}&lang=${language}&_fields=acf`, {
				cache: "no-store",
			});

			if (!res.ok) {
				throw new Error(`Ошибка запроса: ${res.status} ${res.statusText}`);
			}

			const pageData = await res.json();

			set({ data: pageData[0].acf });
		} catch (error: unknown) {
			if (error instanceof Error) {
				console.error("Ошибка при загрузке страницы:", error.message);
				set({ error: error.message });
			} else {
				console.error("Неизвестная ошибка при загрузке страницы");
				set({ error: "Unknown error" });
			}
		} finally {
			set({ projectsPageFetchFinished: true });
		}
	},
}));
