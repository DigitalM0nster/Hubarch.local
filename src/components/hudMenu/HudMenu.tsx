"use client";

import { useEffect } from "react";
import { useAllOptionsStore } from "@/store/allOptionsStore";
import MobileHud from "./MobileHud";
import DesktopHud from "./DesktopHud";
import { useWindowStore } from "@/store/windowStore";
import { useDetectMobile } from "@/hooks/useDetectMobile";

export default function HudMenu() {
	// Используем zustand store
	const { fetchAllOptions } = useAllOptionsStore();
	const { isMobile } = useWindowStore();
	useDetectMobile();

	/* eslint-disable react-hooks/exhaustive-deps */
	useEffect(() => {
		fetchAllOptions();
	}, []);
	/* eslint-enable react-hooks/exhaustive-deps */

	return <>{isMobile ? <MobileHud /> : <DesktopHud />}</>;
}
