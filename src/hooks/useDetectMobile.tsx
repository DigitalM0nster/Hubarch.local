import { useWindowStore } from "@/store/windowStore";
import { useEffect } from "react";

export function useDetectMobile() {
	const { setIsMobile, setWindowWidth, setWindowHeight, windowWidth } = useWindowStore();

	// 💻 Детект мобильного устройства
	useEffect(() => {
		let resizeTimeout: ReturnType<typeof setTimeout>;

		const checkIsMobile = () => {
			setIsMobile(window.innerWidth <= 980);
			setWindowWidth(window.innerWidth);
			setWindowHeight(window.innerHeight);
		};

		const handleResize = () => {
			clearTimeout(resizeTimeout);
			resizeTimeout = setTimeout(() => checkIsMobile(), 50);
		};

		checkIsMobile();
		window.addEventListener("resize", handleResize);

		return () => {
			clearTimeout(resizeTimeout);
			window.removeEventListener("resize", handleResize);
		};
	}, [windowWidth, setIsMobile]);
}
