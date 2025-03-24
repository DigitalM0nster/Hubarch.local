import { create } from "zustand";

export interface GalleryImage {
	alt: string;
	name: string;
	url: string;
}

export interface ProjectEntry {
	project: number | { ID: number };
}

export interface MainPageData {
	main_page_screen1: {
		images?: GalleryImage[];
		text?: string;
	};

	main_page_screen2: {
		number?: string;
		text?: {
			text1: string;
			text2: string;
		};
	};

	main_page_screen3: {
		projects?: [];
		titleBackground?: string;
	};
}

export interface MainPageStore {
	data: MainPageData | null;
	loadedData: boolean;
	error: string | null;
	fetchData: (language: string) => Promise<void>;
	loadedPage: boolean;
	setLoadedPage: (state: boolean) => void;
}

export const useMainPageStore = create<MainPageStore>((set) => ({
	data: null,
	loadedData: false,
	error: null,
	fetchData: async (language) => {
		set({ loadedData: false, error: null });

		const API_URL = "http://admin.hubarch.local/wp-json";
		const slug = "home";

		try {
			const res = await fetch(`${API_URL}/wp/v2/pages?slug=${slug}&lang=${language}&_fields=acf`, {
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

			const projectEntries = acf?.main_page_screen3?.projects || [];

			const projectsWithFields = await Promise.all(
				projectEntries.map(async (entry: ProjectEntry) => {
					const projectId = typeof entry.project === "object" ? entry.project.ID : entry.project;

					if (!projectId) return null;

					const res = await fetch(`${API_URL}/wp/v2/projects/${projectId}?_fields=id,title,acf`, {
						cache: "no-store",
					});
					if (!res.ok) return null;

					const projectData = await res.json();

					return {
						...entry,
						project: projectData,
					};
				})
			);

			// Убираем null'ы из списка
			acf.main_page_screen3.projects = projectsWithFields.filter(Boolean);

			set({ data: acf, loadedData: true });
		} catch (error: unknown) {
			if (error instanceof Error) {
				console.error("Ошибка при загрузке страницы:", error.message);
				set({ error: error.message, loadedData: true });
			} else {
				console.error("Неизвестная ошибка при загрузке страницы");
				set({ error: "Unknown error", loadedData: true });
			}
		}
	},
	loadedPage: false,
	setLoadedPage: (state) => set({ loadedPage: state }),
}));
