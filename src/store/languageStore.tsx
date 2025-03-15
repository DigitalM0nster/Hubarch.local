import { create } from "zustand";

type Language = "ru" | "en";

interface LanguageState {
	language: Language;
	setLanguage: (lang: Language) => void;
}

export const useLanguageStore = create<LanguageState>((set) => ({
	language: "ru", // Язык по умолчанию
	setLanguage: (lang) => set({ language: lang }),
}));

export default useLanguageStore;
