"use client";

import { useEffect, useState } from "react";
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

	useEffect(() => {
		fetchMenuSettings();
	}, []);

	return <>{isMobile ? <MobileHud /> : <DesktopHud />}</>;
}
