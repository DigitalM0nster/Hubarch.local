import { create } from "zustand";

export interface Project {
	id: number;
	title: {
		rendered: string;
	};
	slug: string;
	link: string;
	acf: {
		project_preview: string;
		project_description: string;
		project_type: any[];
		project_awards: any[];
		project_footage: string;
	};
	lang: string;
}

interface AllProjectsStore {
	projectsList: Project[];
	allProjectsFetchFinished: boolean;
	fetchAllProjects: (language: string) => Promise<void>;
}

export const useAllProjectsStore = create<AllProjectsStore>((set) => ({
	projectsList: [],
	allProjectsFetchFinished: false,
	fetchAllProjects: async (language) => {
		set({ allProjectsFetchFinished: false });
		const API_URL = process.env.NEXT_PUBLIC_WP_API;
		if (!API_URL) {
			throw new Error("API_URL не задан в .env файле");
		}
		try {
			const response = await fetch(`${API_URL}/projects?per_page=100&_embed&lang=${language}`);
			const data = await response.json();
			set({ projectsList: data });
		} catch {
			// Тут вывести ошибку
		} finally {
			set({ allProjectsFetchFinished: true });
		}
	},
}));
