"use client";

import { useEffect } from "react";
import { useAllOptionsStore } from "@/store/allOptionsStore";
import MobileHud from "./MobileHud";
import DesktopHud from "./DesktopHud";
import { useWindowStore } from "@/store/windowStore";
import { useDetectMobile } from "@/hooks/useDetectMobile";
import { usePathname } from "next/navigation";

export default function HudMenu() {
	// Используем zustand store
	const { fetchAllOptions } = useAllOptionsStore();
	const { isMobile } = useWindowStore();
	useDetectMobile();
	const pathname = usePathname();
	const language = pathname.startsWith("/en") ? "en" : "ru";

	/* eslint-disable react-hooks/exhaustive-deps */
	useEffect(() => {
		fetchAllOptions();
		// console.log(language);
	}, []);
	/* eslint-enable react-hooks/exhaustive-deps */

	return <>{isMobile ? <MobileHud language={language} /> : <DesktopHud language={language} />}</>;
}
