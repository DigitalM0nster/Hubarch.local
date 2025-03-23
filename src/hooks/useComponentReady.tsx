import { useEffect } from "react";
import { completeComponentReady, registerComponentReady } from "./useFullPreloader";

export function useComponentReady(id: string, isReady: boolean) {
	useEffect(() => {
		if (!isReady) return;
		registerComponentReady(id);
		completeComponentReady(id);
	}, [id, isReady]);
}
