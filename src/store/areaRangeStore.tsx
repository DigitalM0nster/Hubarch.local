import { create } from "zustand";

export interface AreaRange {
	min: number;
	max: number;
	label: string;
}

interface AreaRangeStore {
	ranges: AreaRange[];
	error: string | null;
	fetchRanges: () => Promise<void>;
	areaRangesFetchFinished: boolean;
}

export const useAreaRangeStore = create<AreaRangeStore>((set) => ({
	ranges: [],
	areaRangesFetchFinished: false,
	error: null,

	fetchRanges: async () => {
		set({ areaRangesFetchFinished: false, error: null });

		try {
			const API_URL = process.env.NEXT_PUBLIC_WP_API?.replace("/wp/v2", "") ?? "";
			if (!API_URL) {
				throw new Error("NEXT_PUBLIC_WP_API не задан или некорректен");
			}

			const res = await fetch(`${API_URL}/acf/v3/options/area_ranges_options`);

			if (!res.ok) throw new Error(`Ошибка ${res.status}`);

			const json = await res.json();
			const raw = json.area_ranges || [];

			const ranges = raw.map((item: any) => {
				const min = item.area_range_group?.min;
				const max = item.area_range_group?.max;

				return {
					min,
					max,
					label: `${min}м² — ${max}м²`,
				};
			});

			set({ ranges });
		} catch (error: any) {
			set({ error: error.message || "Unknown error" });
		} finally {
			set({ areaRangesFetchFinished: true });
		}
	},
}));
