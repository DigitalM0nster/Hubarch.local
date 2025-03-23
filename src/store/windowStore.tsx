import { create } from "zustand";

export interface WindowStore {
	isMobile: boolean;
	setIsMobile: (state: boolean) => void;
}

export const useWindowStore = create<WindowStore>((set) => ({
	isMobile: false,
	setIsMobile: (state) => set({ isMobile: state }),
}));
