// src/store/preloaderStore.ts
import { create } from "zustand";

interface PreloaderStore {
	progress: number;
	setProgress: (newProgress: number) => void;

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
	progress: typeof window !== "undefined" ? window.__initialProgress ?? 1 : 1,
	setProgress: (newProgress) => set({ progress: newProgress }),

	componentsToWait: 0,
	markedReady: 0,

	onAllScreensReady: null,
	resetPreloaderCallback: null,

	setTotal: (n) => {
		const { markedReady, onAllScreensReady } = get();
		const newMarkedReady = Math.min(markedReady, n); // на всякий случай

		set({ componentsToWait: n, markedReady: newMarkedReady });

		if (n === 0 || newMarkedReady === n) {
			onAllScreensReady?.();
		}
	},

	markReady: () => {
		const { markedReady, componentsToWait, onAllScreensReady } = get();
		if (markedReady >= componentsToWait) return;

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
