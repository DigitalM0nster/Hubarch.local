// src\store\mainPageStore.tsx

import { create } from "zustand";

export interface GalleryImage {
	alt: string;
	name: string;
	url: string;
}
export interface Letter {
	image: {
		alt: string;
		name: string;
		url: string;
	};
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
		title_background?: string;
	};

	main_page_screen4: {
		text?: string;
		title_background?: string;
	};

	main_page_screen5: {
		team_list?: [];
		title_background?: string;
	};

	main_page_screen6: {
		title_background?: string;
		image?: {
			name: string;
			url: string;
		};
		additional_text?: string;
	};

	main_page_screen7: {
		letters?: Letter[];
	};
}

export interface MainPageStore {
	data: MainPageData | null;
	mainPageFetchingFinished: boolean;
	error: string | null;
	fetchData: (language: string) => Promise<void>;
	awardsByCategory: AwardCategoryGroup[];
	projectsList: any[];
	fetchAwardsAndProjects: (language: string) => Promise<void>;
}

type Award = any;
type AwardByYear = Record<string, Award[]>;
type AwardCategoryGroup = {
	category: any;
	awardsByYear: AwardByYear;
};

export const useMainPageStore = create<MainPageStore>((set) => ({
	data: null,
	mainPageFetchingFinished: false,
	error: null,
	fetchData: async (language) => {
		set({ mainPageFetchingFinished: false, error: null });

		const API_URL = process.env.NEXT_PUBLIC_WP_API;
		const slug = "home";

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

			const projectEntries = acf?.main_page_screen3?.projects || [];

			const projectsWithFields = await Promise.all(
				projectEntries.map(async (entry: ProjectEntry) => {
					const projectId = typeof entry.project === "object" ? entry.project.ID : entry.project;

					if (!projectId) return null;

					const res = await fetch(`${API_URL}/projects/${projectId}?_fields=id,title,acf,slug`, {
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

			set({ data: acf, mainPageFetchingFinished: true });
		} catch (error: unknown) {
			if (error instanceof Error) {
				console.error("Ошибка при загрузке страницы:", error.message);
				set({ error: error.message, mainPageFetchingFinished: true });
			} else {
				console.error("Неизвестная ошибка при загрузке страницы");
				set({ error: "Unknown error", mainPageFetchingFinished: true });
			}
		}
	},
	awardsByCategory: [],
	projectsList: [],
	fetchAwardsAndProjects: async (language) => {
		const API_URL = process.env.NEXT_PUBLIC_WP_API;
		if (!API_URL) {
			throw new Error("API_URL не задан в .env файле");
		}

		const [categories, awards] = await Promise.all([
			fetch(`${API_URL}/award_category?per_page=100`).then((res) => res.json()),
			fetch(`${API_URL}/awards?per_page=100&_embed`).then((res) => res.json()),
		]);

		const grouped: AwardCategoryGroup[] = categories
			.map((cat: any) => {
				const catAwards = awards.filter((award: any) => award.award_category?.includes(cat.id) && award.lang === language);

				const awardsByYear: AwardByYear = {};
				for (const award of catAwards) {
					const year = award.acf?.award_date?.slice(0, 4) || "Год неизвестен";
					if (!awardsByYear[year]) awardsByYear[year] = [];
					awardsByYear[year].push(award);
				}

				return {
					category: cat,
					awardsByYear,
				};
			})
			// вот здесь фильтруем те, у которых вообще нет премий
			.filter(({ awardsByYear }: { awardsByYear: AwardByYear }) => Object.values(awardsByYear).some((awards) => (awards as any[]).length > 0));

		const seenProjectIds = new Set();
		const projects: any[] = [];

		grouped.forEach(({ awardsByYear }) => {
			Object.entries(awardsByYear)
				.sort((a, b) => Number(b[0]) - Number(a[0]))
				.forEach(([_, awards]) => {
					awards.forEach((award) => {
						const project = award._embedded?.["acf:post"]?.[0];
						if (project && !seenProjectIds.has(project.id)) {
							seenProjectIds.add(project.id);
							projects.push(project);
						}
					});
				});
		});

		set({
			awardsByCategory: grouped,
			projectsList: projects,
		});
	},
}));
