// src\components\preloader\LinkWithPreloader.tsx
"use client";

import { usePathname, useRouter } from "next/navigation";
import { usePreloaderStore } from "@/store/preloaderStore";
import { MouseEvent } from "react";
import { useHudMenuStore } from "@/store/hudMenuStore";

type Props = {
	href: string;
	children: React.ReactNode;
	className?: string;
	customClick?: () => void;
	customMouseEnter?: () => void;
	customMouseLeave?: () => void;
};

export default function LinkWithPreloader({ href, children, className, customClick, customMouseEnter, customMouseLeave }: Props) {
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

		// ПЕРЕД ПЕРЕХОДОМ: запускаем анимацию прелоадера и выполняем пользовательские действия
		await triggerResetPreloader();
		if (customClick) {
			await Promise.resolve(customClick());
		}

		// ПОСЛЕ ПОДГОТОВКИ: выполняем переход на новую страницу
		// Это автоматически запустит afterNavigation в новом компоненте Preloader
		router.push(href);
		setActiveMenu(false);
	};

	return (
		<a href={href} onClick={handleClick} className={className} onMouseEnter={customMouseEnter!} onMouseLeave={customMouseLeave!}>
			{children}
		</a>
	);
}
