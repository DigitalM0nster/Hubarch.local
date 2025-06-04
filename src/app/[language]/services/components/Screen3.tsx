"use client";

import { usePreloaderStore } from "@/store/preloaderStore";
import { useEffect } from "react";
import ApplicationComponent from "@/components/applicationComponent/ApplicationComponent";
import { useServicesPageStore } from "@/store/servicesPageStore";

export default function Screen3({ language }: { language: string }) {
	const { markReady } = usePreloaderStore();

	const data = useServicesPageStore((state) => state.data?.services_page_screen3);
	const { servicesPageFetchingFinished } = useServicesPageStore();

	/* eslint-disable react-hooks/exhaustive-deps */
	useEffect(() => {
		if (servicesPageFetchingFinished) {
			markReady();
		}
	}, [servicesPageFetchingFinished, language]);

	/* eslint-enable react-hooks/exhaustive-deps */

	return (
		<>
			<ApplicationComponent language={language} data={data} />
		</>
	);
}
