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
	const { setActiveMenu, setActiveOrderPopup, setActivePopup } = useHudMenuStore();
	const { triggerResetPreloader } = usePreloaderStore();
	const pathname = usePathname();

	const handleClick = async (e: MouseEvent<HTMLAnchorElement>) => {
		e.preventDefault();
		setActiveOrderPopup(false);
		setActivePopup(false);
		// console.log("Произоёшл клик, попытка перехода на страницу:", href);

		// Проверяем, находимся ли мы на той же странице
		if (pathname === href) {
			// console.log("Страница уже открыта, выполняем customClick", "Текущая страница:", pathname, "Целевая страница:", href);
			if (customClick) customClick();
			setActiveMenu(false);
			return;
		}

		try {
			// СНАЧАЛА: выполняем пользовательские действия (customClick)
			if (customClick) {
				// console.log("Выполняем customClick");
				await Promise.resolve(customClick());
			}

			// ЗАТЕМ: запускаем анимацию прелоадера (beforeNavigation)
			// console.log("Запускаем анимацию прелоадера (beforeNavigation)");
			await triggerResetPreloader();

			// ПОСЛЕ ПОДГОТОВКИ: выполняем переход на новую страницу
			// console.log("Выполняем переход на новую страницу:", href);

			// Используем setTimeout для обеспечения завершения анимации прелоадера
			// перед навигацией, что помогает избежать проблем с асинхронными API в Next.js 15
			setTimeout(() => {
				router.push(href);
				setActiveMenu(false);
			}, 100);
		} catch (error) {
			console.error("Ошибка при переходе на страницу:", error);
			// В случае ошибки всё равно пытаемся перейти на страницу
			router.push(href);
			setActiveMenu(false);
		}
	};

	return (
		<a href={href} onClick={handleClick} className={className} style={style} onMouseEnter={customMouseEnter!} onMouseLeave={customMouseLeave!}>
			{children}
		</a>
	);
}
