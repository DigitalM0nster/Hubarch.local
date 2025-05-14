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

interface AllOptionsState {
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
	privacyPolicyData: {
		privacy_policy: {
			ru: string;
			en: string;
		};
	} | null;
	popupData: {
		popup_open_image: {
			image1: string;
			image2: string;
		};
		popup_inside_image: string;
	} | null;
	fetchAllOptions: () => Promise<void>;
}

export const useAllOptionsStore = create<AllOptionsState>((set, get) => ({
	isLoading: true,

	menuSettingsData: null,
	privacyPolicyData: null,
	popupData: null,

	fetchAllOptions: async () => {
		const API_URL = process.env.NEXT_PUBLIC_WP_API?.replace("/wp/v2", "") ?? "";
		if (!API_URL) {
			throw new Error("NEXT_PUBLIC_WP_API не задан или некорректен");
		}
		if (get().menuSettingsData && get().privacyPolicyData && get().popupData) return; // Если данные уже есть, не запрашиваем заново

		set({ isLoading: true });
		try {
			const response = await axios.get(`${API_URL}/acf/v3/options/ANYTHING`);
			set({ menuSettingsData: response.data.menu_settings });
			set({ privacyPolicyData: response.data.privacy_policy });
			set({ popupData: response.data.popup });
		} catch (error) {
			console.error("Ошибка загрузки меню", error);
		} finally {
			set({ isLoading: false });
		}
	},
}));
