// src\store\mainPageStore.tsx

import { create } from "zustand";

export interface Document {
	name: string;
	file: string;
}

export interface DocumentsPageData {
	page_main_settings: {
		background_color: string;
		text_is_light: boolean;
	};
	documents_list: Document[];
}

export interface DocumentsPageStore {
	data: DocumentsPageData | null;
	documentsPageFetchingFinished: boolean;
	error: string | null;
	fetchData: (language: string) => Promise<void>;
}

export const useDocumentsPageStore = create<DocumentsPageStore>((set) => ({
	data: null,
	documentsPageFetchingFinished: false,
	error: null,
	fetchData: async (language) => {
		set({ documentsPageFetchingFinished: false, error: null });

		const API_URL = process.env.NEXT_PUBLIC_WP_API;
		const slug = "documents";

		try {
			const res = await fetch(`${API_URL}/pages?slug=${slug}&lang=${language}&_fields=acf`, {
				cache: "no-store",
			});

			if (!res.ok) {
				throw new Error(`Ошибка запроса: ${res.status} ${res.statusText}`);
			}

			const pages = await res.json();
			if (pages.length === 0) {
				throw new Error("Страница не найдена");
			}

			const acf = pages[0].acf;
			set({ data: acf, documentsPageFetchingFinished: true });
		} catch (error: unknown) {
			if (error instanceof Error) {
				console.error("Ошибка при загрузке страницы:", error.message);
				set({ error: error.message, documentsPageFetchingFinished: true });
			} else {
				console.error("Неизвестная ошибка при загрузке страницы");
				set({ error: "Unknown error", documentsPageFetchingFinished: true });
			}
		}
	},
}));
