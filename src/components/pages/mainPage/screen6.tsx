import { useMainPageStore } from "@/store/mainPageStore";
import { usePreloaderStore } from "@/store/preloaderStore";
import { useEffect } from "react";
import ApplicationComponent from "@/components/applicationComponent/ApplicationComponent";
import { useAreaRangeStore } from "@/store/areaRangeStore";

export default function Screen6({ language }: { language: string }) {
	const { markReady } = usePreloaderStore();

	const data = useMainPageStore((state) => state.data?.main_page_screen6);
	const { mainPageFetchingFinished } = useMainPageStore();
	const { areaRangesFetchFinished } = useAreaRangeStore();

	/* eslint-disable react-hooks/exhaustive-deps */
	useEffect(() => {
		if (mainPageFetchingFinished && areaRangesFetchFinished) {
			markReady();
		}
	}, [mainPageFetchingFinished, areaRangesFetchFinished, language]);

	/* eslint-enable react-hooks/exhaustive-deps */

	return (
		<>
			<ApplicationComponent language={language} data={data} />
		</>
	);
}
