// src\store\mainPageStore.tsx

import { create } from "zustand";

export interface Year {
	year: string;
	text: string;
	number: number;
	color: string;
	color_text: string;
	image: string | false;
}

export interface Partner {
	image: string | false;
}

export interface Contact {
	acf_fc_layout: string;
	contact: string | false;
}

export interface Person {
	image: string | false;
	name: string;
	position: string;
	quote: string;
	contacts: Contact[] | false;
}
export interface Position {
	text: string;
}

export interface AboutPageData {
	about_page: {
		team_screen: Person[] | false;
		history_screen: {
			background_title: string;
			screen_text: string;
			years: Year[] | false;
		};
		space_screen: {
			title: string;
			image: string | false;
			person: {
				quote: string;
				name: string;
				position: Position[] | false;
			};
		};
		partners_screen: {
			text: string;
			partners: Partner[] | false;
		};
		awards_screen: {
			title_background: string;
			text: string;
		};
		next_page: {
			image: string | false;
			link: {
				target: string;
				url: string;
				title: string;
			};
			text: string;
			visible: boolean;
		};
	};
}

export interface AboutPageStore {
	data: AboutPageData | null;
	aboutPageFetchingFinished: boolean;
	error: string | null;
	fetchData: (language: string) => Promise<void>;
}

export const useAboutPageStore = create<AboutPageStore>((set) => ({
	data: null,
	aboutPageFetchingFinished: false,
	error: null,
	fetchData: async (language) => {
		set({ aboutPageFetchingFinished: false, error: null });

		const API_URL = process.env.NEXT_PUBLIC_WP_API;
		const slug = "about";

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
			set({ data: acf, aboutPageFetchingFinished: true });
		} catch (error: unknown) {
			if (error instanceof Error) {
				console.error("Ошибка при загрузке страницы:", error.message);
				set({ error: error.message, aboutPageFetchingFinished: true });
			} else {
				console.error("Неизвестная ошибка при загрузке страницы");
				set({ error: "Unknown error", aboutPageFetchingFinished: true });
			}
		}
	},
}));
