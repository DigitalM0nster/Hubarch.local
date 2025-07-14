"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Хук для проверки полной готовности страницы (загрузка данных, изображений и стабильность DOM)
 * @param {any[]} dependencies - Массив зависимостей, при изменении которых нужно проверить готовность страницы
 * @param {React.RefObject<HTMLElement>} containerRef - Ссылка на контейнер для проверки стабильности DOM
 * @param {number} maxWaitTime - Максимальное время ожидания загрузки изображений (мс)
 * @param {number} stabilityChecks - Количество проверок стабильности DOM
 * @param {number} checkInterval - Интервал между проверками стабильности DOM (мс)
 * @returns {boolean} - true, если страница полностью готова
 */
export const usePageReady = (
	dependencies: any[],
	containerRef: React.RefObject<HTMLElement | HTMLDivElement | null>,
	maxWaitTime: number = 10000,
	stabilityChecks: number = 3,
	checkInterval: number = 100
): boolean => {
	const [pageReady, setPageReady] = useState(false);
	const [imagesLoaded, setImagesLoaded] = useState(false);
	const [domStable, setDomStable] = useState(false);
	const domSnapshotRef = useRef<string>("");
	const stabilityCheckCountRef = useRef(0);
	const checkStartedRef = useRef(false);

	// Проверка загрузки изображений
	useEffect(() => {
		// Если все зависимости загружены
		if (dependencies.every((dep) => dep !== undefined && dep !== null)) {
			// Сбрасываем состояние
			setImagesLoaded(false);

			// Функция для проверки загрузки всех изображений на странице
			const checkImagesLoaded = () => {
				// Получаем все изображения на странице
				const images = document.querySelectorAll("img");

				// Если изображений нет, считаем, что все загружено
				if (images.length === 0) {
					setImagesLoaded(true);
					return;
				}

				// Счетчик загруженных изображений
				let loadedCount = 0;

				// Проверяем каждое изображение
				images.forEach((img) => {
					// Если изображение уже загружено
					if (img.complete) {
						loadedCount++;
					} else {
						// Добавляем обработчик события загрузки
						img.addEventListener(
							"load",
							() => {
								loadedCount++;
								// Если все изображения загружены
								if (loadedCount === images.length) {
									setImagesLoaded(true);
								}
							},
							{ once: true }
						);

						// Обработчик ошибки загрузки (считаем как загруженное)
						img.addEventListener(
							"error",
							() => {
								console.warn("Ошибка загрузки изображения:", img.src);
								loadedCount++;
								if (loadedCount === images.length) {
									setImagesLoaded(true);
								}
							},
							{ once: true }
						);
					}
				});

				// Если все изображения уже загружены
				if (loadedCount === images.length) {
					setImagesLoaded(true);
				}
			};

			// Запускаем проверку после небольшой задержки, чтобы DOM успел обновиться
			const timer = setTimeout(checkImagesLoaded, 100);

			// Устанавливаем максимальное время ожидания
			const maxWaitTimer = setTimeout(() => {
				if (!imagesLoaded) {
					console.warn("Превышено максимальное время ожидания загрузки изображений. Некоторые изображения могут быть не загружены.");
					setImagesLoaded(true);
				}
			}, maxWaitTime);

			return () => {
				clearTimeout(timer);
				clearTimeout(maxWaitTimer);
			};
		}
	}, [...dependencies]);

	// Функция для получения "снимка" DOM
	const getDomSnapshot = () => {
		if (!containerRef.current) return "";
		// Принудительно вызываем перерасчет макета, чтобы убедиться, что все изменения применены
		containerRef.current.getBoundingClientRect();
		return containerRef.current.innerHTML;
	};

	// Проверка стабильности DOM после загрузки изображений
	useEffect(() => {
		if (imagesLoaded && containerRef.current && !domStable && !checkStartedRef.current) {
			checkStartedRef.current = true;

			// Функция для проверки стабильности DOM
			const checkDomStability = () => {
				// Получаем текущий снимок DOM
				const currentSnapshot = getDomSnapshot();

				// Если это первая проверка, просто сохраняем снимок
				if (!domSnapshotRef.current) {
					domSnapshotRef.current = currentSnapshot;
					// Проверяем снова через указанный интервал
					setTimeout(checkDomStability, checkInterval);
					return;
				}

				// Сравниваем текущий снимок с предыдущим
				if (currentSnapshot === domSnapshotRef.current) {
					// DOM не изменился, увеличиваем счетчик стабильности
					stabilityCheckCountRef.current++;

					// Если DOM стабилен в течение указанного количества проверок, считаем его стабильным
					if (stabilityCheckCountRef.current >= stabilityChecks) {
						// console.log("DOM стабилен, рендеринг действительно завершен");
						setDomStable(true);
					} else {
						// Продолжаем проверять
						setTimeout(checkDomStability, checkInterval);
					}
				} else {
					// DOM изменился, сбрасываем счетчик и обновляем снимок
					// console.log("DOM все еще меняется...");
					stabilityCheckCountRef.current = 0;
					domSnapshotRef.current = currentSnapshot;
					setTimeout(checkDomStability, checkInterval);
				}
			};

			// Запускаем первую проверку через небольшую задержку
			setTimeout(checkDomStability, checkInterval);
		}
	}, [imagesLoaded, containerRef.current]);

	// Устанавливаем pageReady, когда изображения загружены и DOM стабилен
	useEffect(() => {
		if (imagesLoaded && domStable) {
			setPageReady(true);
		}
	}, [imagesLoaded, domStable]);

	return pageReady;
};
