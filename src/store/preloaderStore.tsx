// src/store/preloaderStore.ts
import { create } from "zustand";

interface PreloaderStore {
	componentsToWait: number;
	markedReady: number;

	// логика
	setTotal: (n: number) => void;
	markReady: () => void;

	// колбэки
	onAllScreensReady: (() => void) | null;
	setOnAllScreensReady: (cb: () => void) => void;

	resetPreloaderCallback: (() => Promise<void>) | null;
	setResetPreloaderCallback: (cb: () => Promise<void>) => void;
	triggerResetPreloader: () => Promise<void>;
}

export const usePreloaderStore = create<PreloaderStore>((set, get) => ({
	componentsToWait: 0,
	markedReady: 0,

	onAllScreensReady: null,
	resetPreloaderCallback: null,

	setTotal: (n) => {
		set({ componentsToWait: n, markedReady: 0 });

		const { onAllScreensReady } = get();
		if (n === 0 && onAllScreensReady) {
			onAllScreensReady();
		}
	},

	markReady: () => {
		const { markedReady, componentsToWait, onAllScreensReady } = get();
		const newCount = markedReady + 1;
		set({ markedReady: newCount });

		if (newCount === componentsToWait && onAllScreensReady) {
			onAllScreensReady();
		}
	},

	setOnAllScreensReady: (cb) => set({ onAllScreensReady: cb }),

	setResetPreloaderCallback: (cb) => set({ resetPreloaderCallback: cb }),

	triggerResetPreloader: async () => {
		const { resetPreloaderCallback } = get();
		if (resetPreloaderCallback) {
			await resetPreloaderCallback();
		}
	},
}));
