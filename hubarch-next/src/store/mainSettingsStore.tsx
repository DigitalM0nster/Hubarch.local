import { create } from "zustand";
import axios from "axios";

const API_URL = typeof window !== "undefined" && window.location.protocol === "https:" ? "https://hubarch.local/wp-json" : "http://hubarch.local/wp-json";

interface TopMenuItem {
	title: string;
	url: string;
}

interface MainSettingsState {
	mainSettingsData: {
		top_menu_phone: string;
		top_menu_links: TopMenuItem[];
	} | null;
	fetchMainSettings: () => Promise<void>;
}

const useMainSettingsStore = create<MainSettingsState>((set, get) => ({
	mainSettingsData: null,
	fetchMainSettings: async () => {
		if (get().mainSettingsData) return; // Если данные уже есть, не запрашиваем заново

		try {
			const response = await axios.get(`${API_URL}/acf/v3/options/mainSettings`);
			set({ mainSettingsData: response.data });
		} catch (error) {
			console.error("Ошибка загрузки меню", error);
		}
	},
}));

export default useMainSettingsStore;
export { API_URL };
