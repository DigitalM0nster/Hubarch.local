// src\store\mainPageStore.tsx

import { create } from "zustand";

export interface Project {
	id: number;
	title: {
		rendered: string;
	};
	link: string;
	acf: {
		project_preview: string;
		project_footage: number;
	};
	slug: string;
	// acf: string;
}

export interface AwardsAndProjectsStore {
	awardsByCategory: AwardCategoryGroup[];
	projectsList: Project[];
	fetchAwardsAndProjects: (language: string) => Promise<void>;
	awardsAndProjectsFetchingFinished: boolean;
}

type Award = any;
type AwardByYear = Record<string, Award[]>;
type AwardCategoryGroup = {
	category: any;
	awardsByYear: AwardByYear;
};

export const useAwardsAndProjectsStore = create<AwardsAndProjectsStore>((set) => ({
	awardsByCategory: [],
	projectsList: [],
	awardsAndProjectsFetchingFinished: false,
	fetchAwardsAndProjects: async (language) => {
		const API_URL = process.env.NEXT_PUBLIC_WP_API;
		if (!API_URL) {
			throw new Error("API_URL не задан в .env файле");
		}

		try {
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
		} catch {
			// ERROR MUST BE HERE
		} finally {
			set({ awardsAndProjectsFetchingFinished: true });
		}
	},
}));
