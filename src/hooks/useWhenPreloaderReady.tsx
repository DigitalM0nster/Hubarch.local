// hooks/useWhenPreloaderReady.ts
import { useEffect } from "react";
import { usePreloaderStore } from "@/store/preloaderStore";

export function useWhenPreloaderReady(callback: () => void) {
	const isReady = usePreloaderStore((s) => s.isReady);

	useEffect(() => {
		if (isReady) callback();
	}, [isReady]);
}
