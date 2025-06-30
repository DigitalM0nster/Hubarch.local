// src\store\mainPageStore.tsx

import { create } from "zustand";

export interface ServicesPageData {
	services_page_screen1: {
		left_block: {
			background_title?: string;
			text?: string;
		};
		right_block_faq:
			| {
					icon: string | false;
					text: string;
					description: string;
			  }[]
			| false;
	};

	services_page_screen2: {
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
	};

	services_page_screen3: {
		title_background?: string;
		image?: {
			name: string;
			url: string;
		};
		additional_text?: string;
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
}

export interface ServicesPageStore {
	data: ServicesPageData | null;
	servicesPageFetchingFinished: boolean;
	error: string | null;
	fetchData: (language: string) => Promise<void>;
}

export const useServicesPageStore = create<ServicesPageStore>((set) => ({
	data: null,
	servicesPageFetchingFinished: false,
	error: null,
	fetchData: async (language) => {
		set({ servicesPageFetchingFinished: false, error: null });

		const API_URL = process.env.NEXT_PUBLIC_WP_API;
		const slug = "services";

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
			set({ data: acf, servicesPageFetchingFinished: true });
		} catch (error: unknown) {
			if (error instanceof Error) {
				console.error("Ошибка при загрузке страницы:", error.message);
				set({ error: error.message, servicesPageFetchingFinished: true });
			} else {
				console.error("Неизвестная ошибка при загрузке страницы");
				set({ error: "Unknown error", servicesPageFetchingFinished: true });
			}
		}
	},
}));
