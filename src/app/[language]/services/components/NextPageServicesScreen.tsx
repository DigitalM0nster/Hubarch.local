"use client";

import { useServicesPageStore } from "@/store/servicesPageStore";
import { useWindowStore } from "@/store/windowStore";
import NextPageScreen from "@/components/nextPageComponent/NextPageComponent";

export default function NextPageServicesScreen({ language }: { language: string }) {
	const { data } = useServicesPageStore();
	return data?.next_page?.visible && <NextPageScreen data={data?.next_page} language={language} />;
}
