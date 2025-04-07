import { create } from "zustand";

export interface ProjectType {
	id: number;
	name: string;
	slug: string;
	taxonomy: string;
	description: string;
}

interface ProjectTypesStore {
	projectTypes: ProjectType[];
	fetchProjectTypes: (language: string) => Promise<void>;
}

export const useProjectTypesStore = create<ProjectTypesStore>((set) => ({
	projectTypes: [],
	fetchProjectTypes: async (language) => {
		const API_URL = process.env.NEXT_PUBLIC_WP_API;
		if (!API_URL) {
			throw new Error("API_URL не задан в .env файле");
		}

		const response = await fetch(`${API_URL}/project_types?per_page=100&lang=${language}`);
		const data = await response.json();
		set({ projectTypes: data });
	},
}));
