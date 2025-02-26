import { create } from "zustand";
import axios from "axios";
import API_URL from "../config.ts";

// Определяем интерфейс состояния
interface MenuState {
	menuData: {
		top_menu_phone: string;
		top_menu_links: { title: string; url: string }[];
	} | null;
	fetchMenu: () => Promise<void>;
}

// Создаём хранилище Zustand с типами
const useMenuStore = create<MenuState>((set) => ({
	menuData: null,
	fetchMenu: async () => {
		try {
			const response = await axios.get(`${API_URL}acf/v3/options/mainSettings`);
			console.log(response);
			set({ menuData: response.data });
		} catch (error) {
			console.error("Ошибка загрузки меню", error);
		}
	},
}));

export default useMenuStore;
