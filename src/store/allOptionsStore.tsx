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

export interface Letter {
	image: {
		alt: string;
		name: string;
		url: string;
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

export interface PopupData {
	popup_open_image: {
		image1: string;
		image2: string;
	};
	popup_items: {
		background_color?: string;
		text_color?: string;
		title: {
			ru: string;
			en: string;
		};
		image: string | false;
		button_text: {
			ru: string;
			en: string;
		};
	}[];
}
export interface OrderPopupData {
	image: string;
	text: {
		ru: string;
		en: string;
	}[];
	accept_text?: {
		ru?: string;
		en?: string;
	};
}

export interface BannerData {
	background_color: string;
	text: {
		ru: string;
		en: string;
		color: string;
	};
}

export interface PreloaderData {
	image_1: string;
	image_2: string;
	image_3: string;
	image_4: string;
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
	popupData: PopupData | null;
	footerData: {
		letters?: Letter[];
	} | null;
	orderPopupData: OrderPopupData | null;
	bannerData: BannerData | null;
	preloaderData: PreloaderData | null;
	fetchAllOptions: () => Promise<void>;
}

export const useAllOptionsStore = create<AllOptionsState>((set, get) => ({
	isLoading: true,

	menuSettingsData: null,
	privacyPolicyData: null,
	popupData: null,
	footerData: null,
	orderPopupData: null,
	bannerData: null,
	preloaderData: null,

	fetchAllOptions: async () => {
		const API_URL = process.env.NEXT_PUBLIC_WP_API?.replace("/wp/v2", "") ?? "";
		if (!API_URL) {
			throw new Error("NEXT_PUBLIC_WP_API не задан или некорректен");
		}

		set({ isLoading: true });
		try {
			const response = await axios.get(`${API_URL}/acf/v3/options/ANYTHING`);
			set({ menuSettingsData: response.data.menu_settings });
			set({ privacyPolicyData: response.data.privacy_policy });
			set({ popupData: response.data.popup_settings });
			set({ footerData: response.data.footer_screen });
			set({ orderPopupData: response.data.order_settings });
			set({ bannerData: response.data.banner_settings });
			set({ preloaderData: response.data.preloader_settings });
		} catch (error) {
			console.error("Ошибка загрузки меню", error);
		} finally {
			set({ isLoading: false });
		}
	},
}));
