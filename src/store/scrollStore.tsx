import { create } from "zustand";

export interface ScrollStore {
	scrollAllowed: boolean;
	setScrollAllowed: (state: boolean) => void;
}

export const useScrollStore = create<ScrollStore>((set) => ({
	scrollAllowed: false,
	setScrollAllowed: (state) => set({ scrollAllowed: state }),
}));
