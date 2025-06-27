// src\store\approachPageStore.tsx

import { create } from "zustand";

export interface Screen {
	image: string | false;
	text: string;
	title: string;
}

export interface ApproachPageData {
	approach_page: {
		screens_content: Screen[];
		testfit_screen: {
			left_block: {
				text: string;
				image: string | false;
			};
			right_block: {
				text: string;
				button: {
					text: string;
					link: string;
				};
				price_block:
					| {
							text1: string;
							text2: string;
					  }[]
					| false;
			};
			visible: boolean;
		};
		application_screen: {
			title_background?: string;
			image?: {
				name: string;
				url: string;
			};
			additional_text?: string;
		};
	};
}

export interface ApproachPageStore {
	data: ApproachPageData | null;
	approachPageFetchingFinished: boolean;
	approachActiveScreen: number;
	setApproachActiveScreen: (screen: number) => void;
	error: string | null;
	fetchData: (language: string) => Promise<void>;
}

export const useApproachPageStore = create<ApproachPageStore>((set) => ({
	data: null,
	approachPageFetchingFinished: false,
	approachActiveScreen: 0,
	setApproachActiveScreen: (screen: number) => set({ approachActiveScreen: screen }),
	error: null,
	fetchData: async (language) => {
		set({ approachPageFetchingFinished: false, error: null });

		const API_URL = process.env.NEXT_PUBLIC_WP_API;
		const slug = "approach";

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

			set({ data: acf, approachPageFetchingFinished: true });
		} catch (error: unknown) {
			if (error instanceof Error) {
				console.error("Ошибка при загрузке страницы:", error.message);
				set({ error: error.message, approachPageFetchingFinished: true });
			} else {
				console.error("Неизвестная ошибка при загрузке страницы");
				set({ error: "Unknown error", approachPageFetchingFinished: true });
			}
		}
	},
}));
