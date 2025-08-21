"use client";

import { usePreloaderStore } from "@/store/preloaderStore";
import { useEffect } from "react";
import ApplicationComponent from "@/components/applicationComponent/ApplicationComponent";
import { useServicesPageStore } from "@/store/servicesPageStore";

export default function Screen3({ language, text_is_light = false }: { language: string; text_is_light?: boolean }) {
	const data = useServicesPageStore((state) => state.data?.services_page_screen3);

	return (
		<>
			<ApplicationComponent language={language} data={data} text_is_light={text_is_light} />
		</>
	);
}
