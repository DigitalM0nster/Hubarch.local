import { create } from "zustand";

export interface InteractiveLinesStore {
	active: boolean;
	setActiveLinesHud: (active: boolean) => void;

	zIndex: number;
	setNewIndex: (index: number) => void;

	linesColor: "light" | "dark";
	setLinesColor: (newColor: "light" | "dark") => void;

	miniLine: {
		rotation: number;
		setNewRotation: (degrees: number) => void;
	};

	verticalLine: {
		x: number;
		setNewX: (newX: number) => void;

		height: number;
		setHeight: (newHeight: number) => void;
	};

	leftLine: {
		x: number;
		setNewX: (newX: number) => void;

		height: number;
		setHeight: (newHeight: number) => void;
	};

	rightLine: {
		x: number;
		setNewX: (newX: number) => void;

		height: number;
		setHeight: (newHeight: number) => void;
	};

	horizontalLine: {
		x: number;
		setNewX: (newX: number) => void;

		y: number;
		setNewY: (newY: number) => void;

		width: number;
		setWidth: (newWidth: number) => void;
	};
}

export const useInteractiveLinesStore = create<InteractiveLinesStore>((set) => ({
	active: false,
	setActiveLinesHud: (state) => set({ active: state }),

	linesColor: "dark",
	setLinesColor: (newColor) => set({ linesColor: newColor }), // Изменение zIndex

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

		height: 100,
		setHeight: (newHeight) =>
			set((state) => ({
				verticalLine: { ...state.verticalLine, height: newHeight },
			})),
	},
	horizontalLine: {
		x: 50,
		setNewX: (newX) =>
			set((state) => ({
				horizontalLine: { ...state.horizontalLine, x: newX },
			})),

		y: 50,
		setNewY: (newY) =>
			set((state) => ({
				horizontalLine: { ...state.horizontalLine, y: newY },
			})),

		width: 100,
		setWidth: (newWidth) =>
			set((state) => ({
				horizontalLine: { ...state.horizontalLine, width: newWidth },
			})),
	},
	leftLine: {
		x: 50,
		setNewX: (newX) =>
			set((state) => ({
				leftLine: { ...state.leftLine, x: newX },
			})),

		height: 100,
		setHeight: (newHeight) =>
			set((state) => ({
				leftLine: { ...state.leftLine, height: newHeight },
			})),
	},
	rightLine: {
		x: 50,
		setNewX: (newX) =>
			set((state) => ({
				rightLine: { ...state.rightLine, x: newX },
			})),

		height: 100,
		setHeight: (newHeight) =>
			set((state) => ({
				rightLine: { ...state.rightLine, height: newHeight },
			})),
	},
}));
