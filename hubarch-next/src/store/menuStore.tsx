import { create } from "zustand";
import axios from "axios";

const API_URL = "http://hubarch.local/wp-json/";

interface MenuItem {
	title: string;
	url: string;
}

interface MenuState {
	menuData: {
		top_menu_phone: string;
		top_menu_links: MenuItem[];
	} | null;
	fetchMenu: () => Promise<void>;
}

const useMenuStore = create<MenuState>((set) => ({
	menuData: null,
	fetchMenu: async () => {
		try {
			const response = await axios.get(`${API_URL}acf/v3/options/mainSettings`);
			set({ menuData: response.data });
		} catch (error) {
			console.error("Ошибка загрузки меню", error);
		}
	},
}));

export default useMenuStore;
