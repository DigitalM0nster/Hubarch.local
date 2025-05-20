// src\store\projectIdStore.tsx

import { create } from "zustand";

export interface ProjectIdData {
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

export interface ProjectIdStore {
	data: ProjectIdData | null;
	projectDataFetchFinished: boolean;
	error: string | null;
	fetchData: (language: string, projectId: string) => Promise<void>;
	setInitialData: (initialData: ProjectIdData) => void;
}

export const useProjectIdStore = create<ProjectIdStore>((set) => ({
	data: null,
	projectDataFetchFinished: false,
	error: null,
	fetchData: async (language, projectId) => {
		set({ projectDataFetchFinished: false, error: null });

		const API_URL = process.env.NEXT_PUBLIC_WP_API;
		if (!API_URL) {
			throw new Error("API_URL не задан в .env файле");
		}
		try {
			const res = await fetch(`${API_URL}/projects?slug=${projectId}`, {
				cache: "no-store",
			});

			if (!res.ok) {
				throw new Error(`Ошибка запроса: ${res.status} ${res.statusText}`);
			}

			const pageData = await res.json();

			// Находим объект с нужным языком
			const foundItem = pageData.find((item: any) => item.lang === language);

			if (foundItem) {
				// Если нашли объект с нужным языком, используем его
				set({ data: foundItem.acf });
			} else {
				// Если объект с нужным языком не найден, используем первый объект
				console.warn(`Данные для языка ${language} не найдены. Используется первый доступный объект`);
				set({ data: pageData[0].acf });
			}
		} catch (error: unknown) {
			if (error instanceof Error) {
				console.error("Ошибка при загрузке страницы:", error.message);
				set({ error: error.message });
			} else {
				console.error("Неизвестная ошибка при загрузке страницы");
				set({ error: "Unknown error" });
			}
		} finally {
			set({ projectDataFetchFinished: true });
		}
	},
	setInitialData: (initialData) => {
		set({ data: initialData, projectDataFetchFinished: true });
	},
}));
