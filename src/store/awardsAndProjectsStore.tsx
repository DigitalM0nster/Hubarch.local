// src/store/awardsAndProjectsStore.ts

import { create } from "zustand";

interface Nomination {
	nomination: string;
	project: Project;
}

interface AwardTerm {
	id: number;
	name: string;
	slug: string;
	acf?: {
		category_award_image?: string;
	};
}

interface Project {
	id: number;
	title: {
		rendered: string;
	};
	slug: string;
	link: string;
	lang: string;
	acf: {
		project_preview: string | false;
		project_awards: {
			award: {
				year: string;
				title: {
					term_id: number;
					name: string;
					slug: string;
				};
				nominations: {
					nomination: string;
				}[];
			};
		}[];
	};
}

interface StructuredAward {
	id: number;
	name: string;
	slug: string;
	acf?: any;
	years: Record<string, Nomination[]>;
}

interface AwardsAndProjectsStore {
	projectsList: Project[];
	structuredAwards: StructuredAward[];
	fetchAwardsAndProjects: (language: string) => Promise<void>;
	awardsAndProjectsFetchingFinished: boolean;
}

export const useAwardsAndProjectsStore = create<AwardsAndProjectsStore>((set) => ({
	projectsList: [],
	structuredAwards: [],
	awardsAndProjectsFetchingFinished: false,

	fetchAwardsAndProjects: async (language) => {
		const API_URL = process.env.NEXT_PUBLIC_WP_API;
		if (!API_URL) throw new Error("API URL not set");

		try {
			const [projectsRes, awardsRes] = await Promise.all([fetch(`${API_URL}/projects?per_page=100&_embed`), fetch(`${API_URL}/awards?per_page=100`)]);

			const projects: Project[] = await projectsRes.json();
			const awardTerms: AwardTerm[] = await awardsRes.json();

			const awardMap: Record<number, StructuredAward> = {};

			for (const project of projects) {
				if (project.lang !== language) continue; // 🔴 Фильтруем по языку

				const awards = project.acf?.project_awards || [];

				for (const entry of awards) {
					const award = entry.award;
					if (!award?.title || !award.year) continue;

					const id = award.title.term_id;
					const year = award.year;
					const name = award.title.name;
					const slug = award.title.slug;

					// Найдём ACF поля из списка всех awards
					const fullAwardData = awardTerms.find((a) => a.id === id);

					if (!awardMap[id]) {
						awardMap[id] = {
							id,
							name,
							slug,
							acf: fullAwardData?.acf || {},
							years: {},
						};
					}
					if (!awardMap[id].years[year]) {
						awardMap[id].years[year] = [];
					}

					const nominations = award.nominations || [];
					for (const nomination of nominations) {
						const exists = awardMap[id].years[year].some((n) => n.nomination === nomination.nomination && n.project.id === project.id);
						if (!exists) {
							awardMap[id].years[year].push({
								nomination: nomination.nomination,
								project,
							});
						}
					}
				}
			}

			set({
				projectsList: projects,
				structuredAwards: Object.values(awardMap),
			});
		} catch (e) {
			console.error("Ошибка при загрузке премий:", e);
		} finally {
			set({ awardsAndProjectsFetchingFinished: true });
		}
	},
}));
