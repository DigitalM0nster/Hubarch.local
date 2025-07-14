// src/store/preloaderStore.ts
import { create } from "zustand";

// Интерфейс для хранения информации о размерах и позиции изображения
interface ImageRect {
	x: string;
	y: string;
	width: string;
	height: string;
	top: string;
	right: string;
	bottom: string;
	left: string;
	transition: string;
	opacity: number;
	innerImageWidth: string;
	innerImageHeight: string;
	progressLineTransition: string;
	progressTransition: string;
}

interface Image {
	src: string | false;
}

interface PreloaderStore {
	progress: number;
	setProgress: (newProgress: number) => void;
	pageState: "default" | "loading" | "ready";
	setPageState: (newState: "default" | "loading" | "ready") => void;
	isProjectLoading: boolean;
	setIsProjectLoading: (newState: boolean) => void;
	projectImage: string | false;
	setProjectImage: (newImage: string | false) => void;
	imageRect: ImageRect | null;
	setImageRect: (rect: ImageRect | null) => void;
	cachedImages: Image[];
	setCachedImages: (images: Image[]) => void;
	addCachedImage: (image: Image) => void; // Новый метод для добавления одного изображения

	resetPreloaderCallback: (() => Promise<void>) | null;
	setResetPreloaderCallback: (cb: () => Promise<void>) => void;
	triggerResetPreloader: () => Promise<void>;
}

export const usePreloaderStore = create<PreloaderStore>((set, get) => ({
	progress: 1,
	setProgress: (newProgress) => set({ progress: newProgress }),
	pageState: "default",
	setPageState: (newState) => set({ pageState: newState }),
	isProjectLoading: false,
	setIsProjectLoading: (newState) => set({ isProjectLoading: newState }),
	projectImage: "",
	setProjectImage: (newImage) => set({ projectImage: newImage }),
	imageRect: null,
	setImageRect: (rect) => set({ imageRect: rect }),
	cachedImages: [],
	setCachedImages: (images) => set({ cachedImages: images }),
	addCachedImage: (image) =>
		set((state) => {
			// Проверяем, есть ли уже такое изображение в массиве
			const exists = state.cachedImages.some((cachedImage) => cachedImage.src === image.src);

			// Если изображения нет, добавляем его
			if (!exists && image.src !== false) {
				return { cachedImages: [...state.cachedImages, image] };
			}

			// Если изображение уже есть, возвращаем текущее состояние
			return state;
		}),

	resetPreloaderCallback: null,
	setResetPreloaderCallback: (cb) => set({ resetPreloaderCallback: cb }),
	triggerResetPreloader: async () => {
		const { resetPreloaderCallback } = get();
		if (resetPreloaderCallback) {
			await resetPreloaderCallback();
		}
	},
}));
