import { useEffect, useState, useRef, useLayoutEffect } from "react";
import { useScrollStore } from "@/store/scrollStore";
import { useWindowStore } from "@/store/windowStore";
import { useHudMenuStore } from "@/store/hudMenuStore";
import { usePathname } from "next/navigation";
import { useScreenInit } from "@/hooks/useScreenInit";
import { useApproachPageStore } from "@/store/approachPageStore";

export const useScreenScroll = (moduleStyles?: Record<string, string>) => {
	// Получаем состояния из хранилищ
	const { scrollAllowed, setScrollAllowed } = useScrollStore();
	const { isMobile } = useWindowStore();
	const { activeMenu } = useHudMenuStore();
	const pathname = usePathname();

	// Состояние для отслеживания активного экрана
	const [activeScreenIndex, setActiveScreenIndex] = useState(0);
	const { setApproachActiveScreen } = useApproachPageStore();

	// Рефы для отслеживания состояний без перерендеров
	const scrollAllowedRef = useRef(scrollAllowed);
	const scrollAllowedLocalRef = useRef(true);
	const activeMenuRef = useRef(activeMenu);

	// Реф для защиты от двойного срабатывания на тачпаде
	const lastScrollTimeRef = useRef(0);
	const scrollThrottleTimeRef = useRef(300); // Минимальное время между скроллами в мс

	// Получаем необходимые функции и рефы из хука инициализации
	const { changeScreenOptions, screensRef, simpleScrollRef } = useScreenInit();

	// Обновляем рефы при изменении соответствующих состояний
	useEffect(() => {
		scrollAllowedRef.current = scrollAllowed;
	}, [scrollAllowed]);

	useEffect(() => {
		activeMenuRef.current = activeMenu;
	}, [activeMenu]);

	// Функция для обновления классов активных экранов
	const updateActiveClasses = () => {
		if (!screensRef.current) return;

		screensRef.current.forEach((screen, index) => {
			const isPrev = index < activeScreenIndex;
			const isActive = index === activeScreenIndex;

			// Добавляем/удаляем базовые классы
			screen.classList.toggle("prev", isPrev);
			screen.classList.toggle("active", isActive);

			// Добавляем/удаляем кастомные классы из модуля стилей, если они есть
			if (moduleStyles) {
				screen.classList.toggle(moduleStyles.prev, isPrev);
				screen.classList.toggle(moduleStyles.active, isActive);

				if (!isPrev && !isActive) {
					screen.classList.remove(moduleStyles.prev, moduleStyles.active);
				}
			}
		});
	};

	// Инициализация экранов при изменении пути
	useLayoutEffect(() => {
		screensRef.current = document.querySelectorAll(".screen");
		if (screensRef.current[0]?.parentElement?.classList.contains("simpleScroll")) {
			simpleScrollRef.current = true;
		}
	}, [pathname]);

	// Полноэкранный скролл для десктопа
	useLayoutEffect(() => {
		const handleScroll = (event: WheelEvent | KeyboardEvent) => {
			// Проверяем все условия, при которых скролл должен быть заблокирован
			if (!scrollAllowedLocalRef.current) return;
			if (isMobile || !screensRef.current?.length) return;
			if (!scrollAllowedRef.current || activeMenuRef.current) return;
			if (simpleScrollRef.current) return;

			// Обработка события колеса мыши
			if (event instanceof WheelEvent) {
				// Защита от двойного срабатывания на тачпаде
				const now = Date.now();
				if (now - lastScrollTimeRef.current < scrollThrottleTimeRef.current) {
					event.preventDefault();
					return;
				}
				lastScrollTimeRef.current = now;

				// Проверяем, находится ли курсор над зоной, где скролл должен работать обычным образом
				const elUnderMouse = document.elementFromPoint(event.clientX, event.clientY);
				const scrollZone = elUnderMouse?.closest(".noScreenScrollZone") as HTMLElement | null;

				if (scrollZone) {
					// Находим ближайший прокручиваемый элемент к точке клика
					const scrollables = Array.from(document.querySelectorAll<HTMLElement>(".scrollable"));

					let nearestScrollable: HTMLElement | null = null;
					let nearestDistance = Infinity;

					// Ищем ближайший скроллируемый элемент
					for (const scrollable of scrollables) {
						const rect = scrollable.getBoundingClientRect();
						const centerX = rect.left + rect.width / 2;
						const centerY = rect.top + rect.height / 2;

						const dx = event.clientX - centerX;
						const dy = event.clientY - centerY;
						const distance = Math.sqrt(dx * dx + dy * dy);

						if (distance < nearestDistance) {
							nearestDistance = distance;
							nearestScrollable = scrollable;
						}
					}

					// Если нашли ближайший элемент, проверяем, можно ли его прокрутить
					if (nearestScrollable) {
						const { scrollTop, scrollHeight, clientHeight } = nearestScrollable;

						const isAtTop = scrollTop === 0;
						const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;

						// Если элемент можно прокрутить в направлении скролла, делаем это
						if ((event.deltaY < 0 && !isAtTop) || (event.deltaY > 0 && !isAtBottom)) {
							nearestScrollable.scrollTop += event.deltaY;
							event.preventDefault();
							return;
						}
					}
				}
			}

			// Определяем новый индекс экрана
			let newIndex = activeScreenIndex;

			// Изменяем индекс в зависимости от типа события
			if (event instanceof WheelEvent) {
				// Определяем направление скролла (вверх/вниз)
				newIndex += event.deltaY > 0 ? 1 : -1;
			} else if (event instanceof KeyboardEvent) {
				// Обрабатываем навигацию с клавиатуры
				if (["ArrowDown", "PageDown"].includes(event.key)) newIndex++;
				if (["ArrowUp", "PageUp"].includes(event.key)) newIndex--;
			}

			// Ограничиваем индекс в пределах доступных экранов
			newIndex = Math.max(0, Math.min(newIndex, screensRef.current.length - 1));

			// Если индекс изменился, выполняем переход к новому экрану
			if (newIndex !== activeScreenIndex) {
				// Блокируем скролл на время анимации
				scrollAllowedLocalRef.current = false;
				setScrollAllowed(false);

				// Обновляем активный экран
				setActiveScreenIndex(newIndex);
				setApproachActiveScreen(newIndex);

				// Применяем настройки для нового экрана
				const screen = screensRef.current[newIndex] as HTMLElement;
				changeScreenOptions(screen);

				// Разблокируем скролл после завершения анимации
				setTimeout(() => {
					scrollAllowedLocalRef.current = true;
					setScrollAllowed(true);
				}, 800);
			}
		};

		// Добавляем обработчики событий
		window.addEventListener("wheel", handleScroll, { passive: false });
		window.addEventListener("keydown", handleScroll);

		// Удаляем обработчики при размонтировании
		return () => {
			window.removeEventListener("wheel", handleScroll);
			window.removeEventListener("keydown", handleScroll);
		};
	}, [activeScreenIndex, isMobile]);

	// Обычный скролл для мобильных устройств и страниц с простым скроллом
	useLayoutEffect(() => {
		// Если не мобильное устройство и не простой скролл, выходим
		if (!isMobile && !simpleScrollRef.current) return;

		let observer: IntersectionObserver;

		// Функция для настройки наблюдателя пересечений
		const tryObserve = () => {
			const screens = document.querySelectorAll(".screen");
			if (!screens.length) {
				// Если экраны еще не загружены, пробуем снова через кадр
				requestAnimationFrame(tryObserve);
				return;
			}
			screensRef.current = screens;

			// Создаем наблюдатель пересечений для отслеживания видимых экранов
			observer = new IntersectionObserver(
				(entries) => {
					for (const entry of entries) {
						if (entry.isIntersecting) {
							// Находим индекс видимого экрана
							const index = Array.from(screensRef.current!).findIndex((el) => el === entry.target);
							if (index !== -1) {
								// Обновляем активный экран
								setActiveScreenIndex(index);
								setApproachActiveScreen(index);
								changeScreenOptions(entry.target as HTMLElement);
							}
						}
					}
				},
				{ threshold: 0.5 } // Элемент считается видимым, когда показано 50% его площади
			);

			// Начинаем наблюдение за всеми экранами
			screensRef.current.forEach((screen) => observer.observe(screen));
		};

		// Запускаем настройку наблюдателя
		requestAnimationFrame(tryObserve);

		// Отключаем наблюдатель при размонтировании
		return () => {
			observer?.disconnect();
		};
	}, [isMobile]);

	// Обновляем классы при изменении активного экрана
	useLayoutEffect(() => {
		updateActiveClasses();
	}, [activeScreenIndex]);

	// Возвращаем индекс активного экрана для использования в компонентах
	return { activeScreenIndex };
};
