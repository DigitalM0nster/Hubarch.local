import { create } from "zustand";
import axios from "axios";

const API_URL = typeof window !== "undefined" && window.location.protocol === "https:" ? "https://admin.hubarch.local/wp-json" : "http://admin.hubarch.local/wp-json";

interface TopMenuItem {
	title: string;
	url: string;
}

interface MenuSettingsState {
	menuSettingsData: {
		top_menu_phone: string;
		top_menu_links: TopMenuItem[];
	} | null;
	fetchMenuSettings: () => Promise<void>;
}

const useMenuSettingsStore = create<MenuSettingsState>((set, get) => ({
	menuSettingsData: null,
	fetchMenuSettings: async () => {
		if (get().menuSettingsData) return; // Если данные уже есть, не запрашиваем заново

		try {
			const response = await axios.get(`${API_URL}/acf/v3/options/menu_settings?lang=ru`);
			console.log(response);
			set({ menuSettingsData: response.data });
		} catch (error) {
			console.error("Ошибка загрузки меню", error);
		}
	},
}));

export default useMenuSettingsStore;
export { API_URL };
