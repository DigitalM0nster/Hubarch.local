// src\components\preloader\LinkWithPreloader.tsx
"use client";

import { usePathname, useRouter } from "next/navigation";
import { usePreloaderStore } from "@/store/preloaderStore";
import { MouseEvent, CSSProperties } from "react";
import { useHudMenuStore } from "@/store/hudMenuStore";

type Props = {
	href: string;
	children: React.ReactNode;
	className?: string;
	style?: CSSProperties;
	customClick?: () => void;
	customMouseEnter?: () => void;
	customMouseLeave?: () => void;
};

export default function LinkWithPreloader({ href, children, className, style, customClick, customMouseEnter, customMouseLeave }: Props) {
	if (!href || href === "undefined") {
		console.error("🚨 [LinkWithPreloader] href is invalid:", href);
	}

	const router = useRouter();
	const { setActiveMenu } = useHudMenuStore();
	const { triggerResetPreloader } = usePreloaderStore();
	const pathname = usePathname();

	const handleClick = async (e: MouseEvent<HTMLAnchorElement>) => {
		e.preventDefault();

		if (pathname === href) {
			if (customClick) customClick();
			setActiveMenu(false);
			return;
		}

		// СНАЧАЛА: выполняем пользовательские действия (customClick)
		if (customClick) {
			await Promise.resolve(customClick());
		}

		// ЗАТЕМ: запускаем анимацию прелоадера (beforeNavigation)
		await triggerResetPreloader();

		// ПОСЛЕ ПОДГОТОВКИ: выполняем переход на новую страницу
		// Это автоматически запустит afterNavigation в новом компоненте Preloader
		router.push(href);
		setActiveMenu(false);
	};

	return (
		<a href={href} onClick={handleClick} className={className} style={style} onMouseEnter={customMouseEnter!} onMouseLeave={customMouseLeave!}>
			{children}
		</a>
	);
}
