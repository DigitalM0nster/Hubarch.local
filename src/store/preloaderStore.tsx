// src/store/preloaderStore.ts
import { create } from "zustand";

interface PreloaderStore {
	progress: number;
	setProgress: (newProgress: number) => void;
	pageState: "loading" | "ready";
	setPageState: (newState: "loading" | "ready") => void;

	resetPreloaderCallback: (() => Promise<void>) | null;
	setResetPreloaderCallback: (cb: () => Promise<void>) => void;
	triggerResetPreloader: () => Promise<void>;
}

export const usePreloaderStore = create<PreloaderStore>((set, get) => ({
	progress: typeof window !== "undefined" ? window.__initialProgress ?? 1 : 1,
	setProgress: (newProgress) => set({ progress: newProgress }),
	pageState: "loading",
	setPageState: (newState) => set({ pageState: newState }),

	resetPreloaderCallback: null,

	setResetPreloaderCallback: (cb) => set({ resetPreloaderCallback: cb }),

	triggerResetPreloader: async () => {
		const { resetPreloaderCallback } = get();
		if (resetPreloaderCallback) {
			await resetPreloaderCallback();
		}
	},
}));
