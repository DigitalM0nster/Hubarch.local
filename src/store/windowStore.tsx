// src/store/windowStore.tsx
import { create } from "zustand";

export interface WindowStore {
	windowWidth: number;
	setWindowWidth: (newNumber: number) => void;

	windowHeight: number;
	setWindowHeight: (newNumber: number) => void;

	isMobile: boolean;
	setIsMobile: (state: boolean) => void;
}

// Задаём дефолтные значения — безопасные для SSR
export const useWindowStore = create<WindowStore>((set) => ({
	windowWidth: 1920,
	setWindowWidth: (newNumber) => set({ windowWidth: newNumber }),

	windowHeight: 1080,
	setWindowHeight: (newNumber) => set({ windowHeight: newNumber }),

	isMobile: false,
	setIsMobile: (state) => set({ isMobile: state }),
}));
