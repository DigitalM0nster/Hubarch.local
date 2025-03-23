import { create } from "zustand";

export interface InteractiveLinesStore {
	active: boolean;
	setActiveLinesHud: (active: boolean) => void;

	zIndex: number;
	setNewIndex: (index: number) => void;

	miniLine: {
		rotation: number;
		setNewRotation: (degrees: number) => void; // Метод для изменения miniLine.rotation
	};

	verticalLine: {
		x: number;
		setNewX: (newX: number) => void; // Метод для изменения miniLine.rotation
	};
}

export const useInteractiveLinesStore = create<InteractiveLinesStore>((set) => ({
	active: false,
	setActiveLinesHud: (state) => set({ active: state }),

	zIndex: 0,
	setNewIndex: (index) => set({ zIndex: index }), // Изменение zIndex

	miniLine: {
		rotation: 45,
		setNewRotation: (degrees) =>
			set((state) => ({
				miniLine: { ...state.miniLine, rotation: degrees }, // Корректное обновление вложенного объекта
			})),
	},
	verticalLine: {
		x: 50,
		setNewX: (newX) =>
			set((state) => ({
				verticalLine: { ...state.verticalLine, x: newX },
			})),
	},
}));
