import { create } from "zustand";
import axios from "axios";

interface MenuLink {
	link: {
		ru: {
			title: string;
			url: string;
		};

		en: {
			title: string;
			url: string;
		};
	};
}

interface TopMenuConnectText {
	text_ru: string;
	text_en: string;
}

interface TopMenuPhone {
	phone_en: string;
	phone_ru: string;
}

interface MenuSettingsState {
	isLoading: boolean;
	menuSettingsData: {
		top_menu_logo: {
			desktop_logo: {
				logo_light: string;
				logo_dark: string;
			};
			mobile_logo: {
				logo_light: string;
				logo_dark: string;
			};
		};
		top_menu_phone: TopMenuPhone;
		top_menu_links: MenuLink[];
		top_menu_connect_text: TopMenuConnectText;
		right_menu_links: MenuLink[];
		left_menu_links: MenuLink[];
		bottom_menu_links: MenuLink[];
		bottom_right_image: string;
	} | null;
	fetchMenuSettings: () => Promise<void>;
}

export const useMenuSettingsStore = create<MenuSettingsState>((set, get) => ({
	menuSettingsData: null,
	isLoading: true,

	fetchMenuSettings: async () => {
		const API_URL = process.env.NEXT_PUBLIC_WP_API?.replace("/wp/v2", "") ?? "";
		if (!API_URL) {
			throw new Error("NEXT_PUBLIC_WP_API не задан или некорректен");
		}
		if (get().menuSettingsData) return; // Если данные уже есть, не запрашиваем заново

		set({ isLoading: true });
		try {
			const response = await axios.get(`${API_URL}/acf/v3/options/menu_settings`);
			set({ menuSettingsData: response.data, isLoading: false });
		} catch (error) {
			console.error("Ошибка загрузки меню", error);
		}
	},
}));
