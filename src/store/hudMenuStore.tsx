import { create } from "zustand";

export interface HudMenuStore {
	screenLightness: "dark" | "light";
	setScreenLightness: (state: "dark" | "light") => void;

	activeMenu: boolean;
	setActiveMenu: (state: boolean) => void;

	activePage: string;
	setActivePage: (page: string) => void;
}

export const useHudMenuStore = create<HudMenuStore>((set) => ({
	screenLightness: "light",
	setScreenLightness: (state) => set({ screenLightness: state }), // Изменение zIndex

	activeMenu: false,
	setActiveMenu: (state) => set({ activeMenu: state }),

	activePage: "/",
	setActivePage: (page) => set({ activePage: page }),
}));
