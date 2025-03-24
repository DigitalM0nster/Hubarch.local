"use client";

import { useEffect } from "react";
import { useMenuSettingsStore } from "@/store/menuSettingsStore";
import MobileHud from "./MobileHud";
import DesktopHud from "./DesktopHud";
import { useWindowStore } from "@/store/windowStore";
import { useDetectMobile } from "@/hooks/useDetectMobile";

export default function HudMenu() {
	// Используем zustand store
	const { fetchMenuSettings } = useMenuSettingsStore();
	const { isMobile } = useWindowStore();
	useDetectMobile();

	/* eslint-disable react-hooks/exhaustive-deps */
	useEffect(() => {
		fetchMenuSettings();
	}, []);
	/* eslint-enable react-hooks/exhaustive-deps */

	return <>{isMobile ? <MobileHud /> : <DesktopHud />}</>;
}
