"use client";

import TestfitComponent from "@/components/testfitComponent/TestfitComponent";
import { useApproachPageStore } from "@/store/approachPageStore";

export default function Screen2({ language }: { language: string }) {
	const { data } = useApproachPageStore();
	return <>{data?.approach_page?.testfit_screen?.visible && <TestfitComponent data={data?.approach_page?.testfit_screen} language={language} />}</>;
}
