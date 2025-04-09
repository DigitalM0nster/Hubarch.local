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
	projectTypesFetchFinished: boolean;
	fetchProjectTypes: (language: string) => Promise<void>;
}

export const useProjectTypesStore = create<ProjectTypesStore>((set) => ({
	projectTypes: [],
	projectTypesFetchFinished: false,
	fetchProjectTypes: async (language) => {
		set({ projectTypesFetchFinished: false });
		const API_URL = process.env.NEXT_PUBLIC_WP_API;
		if (!API_URL) {
			throw new Error("API_URL не задан в .env файле");
		}
		try {
			const response = await fetch(`${API_URL}/project_types?per_page=100&lang=${language}`);
			const data = await response.json();
			set({ projectTypes: data });
		} catch {
			// Тут ошибка
		} finally {
			set({ projectTypesFetchFinished: true });
		}
	},
}));
