"use client";

import { useEffect } from "react";
import { usePreloaderStore } from "@/store/preloaderStore";
import { useScrollStore } from "@/store/scrollStore";

export default function Preloader404() {
	const { markReady, setTotal } = usePreloaderStore();
	const { setScrollAllowed } = useScrollStore();

	useEffect(() => {
		// страница готова, разрешаем скролл и помечаем как загруженную
		setTotal(1);
		markReady();
		setScrollAllowed(true);
	}, []);

	return null; // прелоадер уже будет работать, компонент ничего не рендерит сам
}
