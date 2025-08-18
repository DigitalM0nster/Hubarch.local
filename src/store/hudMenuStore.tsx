import { create } from "zustand";

export interface HudMenuStore {
	screenLightness: "dark" | "light";
	setScreenLightness: (state: "dark" | "light") => void;

	activeMenu: boolean;
	setActiveMenu: (state: boolean) => void;

	activePage: string;
	setActivePage: (page: string) => void;

	activePopup: boolean;
	setActivePopup: (state: boolean) => void;

	activeOrderPopup: boolean;
	setActiveOrderPopup: (state: boolean) => void;

	isTopBannerActive: boolean;
	setIsTopBannerActive: (state: boolean) => void;

	cookieHudActive: boolean;
	setCookieHudActive: (state: boolean) => void;

	visibleMobileFilters: boolean;
	setVisibleMobileFilters: (state: boolean) => void;
}

export const useHudMenuStore = create<HudMenuStore>((set) => ({
	screenLightness: "light",
	setScreenLightness: (state) => set({ screenLightness: state }), // Изменение zIndex

	activeMenu: false,
	setActiveMenu: (state) => set({ activeMenu: state }),

	activePage: "/",
	setActivePage: (page) => set({ activePage: page }),

	activePopup: false,
	setActivePopup: (state) => set({ activePopup: state }),

	activeOrderPopup: false,
	setActiveOrderPopup: (state) => set({ activeOrderPopup: state }),

	isTopBannerActive: true,
	setIsTopBannerActive: (state) => set({ isTopBannerActive: state }),

	cookieHudActive: true,
	setCookieHudActive: (state) => set({ cookieHudActive: state }),

	visibleMobileFilters: false,
	setVisibleMobileFilters: (state) => set({ visibleMobileFilters: state }),
}));
