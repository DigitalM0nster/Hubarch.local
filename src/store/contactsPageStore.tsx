// src\store\mainPageStore.tsx

import { create } from "zustand";

// Интерфейс для координат на карте
export interface MapCoordinates {
	lat: number;
	lng: number;
}

// Интерфейс для контакта
export interface Contact {
	acf_fc_layout: string;
	text: string;
	link?: string;
}

// Интерфейс для элемента карты
export interface MapItem {
	title?: string;
	adress?: string;
	coords?: MapCoordinates;
	contacts?: Contact[];
	coordinates?: {
		coordinate1: string;
		coordinate2: string;
	};
}

export interface ContactsPageData {
	contacts_page: {
		map_items: MapItem[] | false;
		application: {
			title_background?: string;
			image?: {
				name: string;
				url: string;
			};
			additional_text?: string;
		};
	};
}

export interface ContactsPageStore {
	data: ContactsPageData | null;
	contactsPageFetchingFinished: boolean;
	error: string | null;
	fetchData: (language: string) => Promise<void>;
}

export const useContactsPageStore = create<ContactsPageStore>((set) => ({
	data: null,
	contactsPageFetchingFinished: false,
	error: null,
	fetchData: async (language) => {
		set({ contactsPageFetchingFinished: false, error: null });

		const API_URL = process.env.NEXT_PUBLIC_WP_API;
		const slug = "contacts";

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
			console.log(acf);
			set({ data: acf, contactsPageFetchingFinished: true });
		} catch (error: unknown) {
			if (error instanceof Error) {
				console.error("Ошибка при загрузке страницы:", error.message);
				set({ error: error.message, contactsPageFetchingFinished: true });
			} else {
				console.error("Неизвестная ошибка при загрузке страницы");
				set({ error: "Unknown error", contactsPageFetchingFinished: true });
			}
		}
	},
}));
