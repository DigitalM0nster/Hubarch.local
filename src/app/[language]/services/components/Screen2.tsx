"use client";

import TestfitComponent from "@/components/testfitComponent/TestfitComponent";
import { useServicesPageStore } from "@/store/servicesPageStore";

export default function Screen2({ language }: { language: string }) {
	const { data } = useServicesPageStore();
	return <TestfitComponent data={data?.services_page_screen2} language={language} />;
}
