"use client";

import { useEffect } from "react";
import { usePreloaderStore } from "@/store/preloaderStore";
import { useScrollStore } from "@/store/scrollStore";

export default function Preloader404() {
	const { markReady, setTotal } = usePreloaderStore();
	const { setScrollAllowed } = useScrollStore();

	/* eslint-disable react-hooks/exhaustive-deps */
	useEffect(() => {
		// страница готова, разрешаем скролл и помечаем как загруженную
		setTotal(1);
		markReady();
		setScrollAllowed(true);
	}, []);
	/* eslint-enable react-hooks/exhaustive-deps */

	return null; // прелоадер уже будет работать, компонент ничего не рендерит сам
}
