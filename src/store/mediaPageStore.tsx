// src\store\mainPageStore.tsx

import { create } from "zustand";

export interface MediaPageData {
	page_main_settings: {
		background_color: string;
	};
}

export interface MediaPageStore {
	data: MediaPageData | null;
	mediaPageFetchingFinished: boolean;
	error: string | null;
	fetchData: (language: string) => Promise<void>;
}

export const useMediaPageStore = create<MediaPageStore>((set) => ({
	data: null,
	mediaPageFetchingFinished: false,
	error: null,
	fetchData: async (language) => {
		set({ mediaPageFetchingFinished: false, error: null });

		const API_URL = process.env.NEXT_PUBLIC_WP_API;
		const slug = "media";

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
			set({ data: acf, mediaPageFetchingFinished: true });
		} catch (error: unknown) {
			if (error instanceof Error) {
				console.error("Ошибка при загрузке страницы:", error.message);
				set({ error: error.message, mediaPageFetchingFinished: true });
			} else {
				console.error("Неизвестная ошибка при загрузке страницы");
				set({ error: "Unknown error", mediaPageFetchingFinished: true });
			}
		}
	},
}));
