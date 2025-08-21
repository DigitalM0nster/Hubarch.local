"use client";

import TestfitComponent from "@/components/testfitComponent/TestfitComponent";
import { useServicesPageStore } from "@/store/servicesPageStore";

export default function Screen2({ language, text_is_light = false }: { language: string; text_is_light?: boolean }) {
	const { data } = useServicesPageStore();
	return <TestfitComponent data={data?.services_page_screen2} language={language} text_is_light={text_is_light} />;
}
