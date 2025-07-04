"use client";

import { useEffect, useState } from "react";

/**
 * Хук для проверки загрузки всех изображений на странице
 * @param {boolean} dependency - Зависимость, при изменении которой нужно проверить загрузку изображений
 * @param {number} maxWaitTime - Максимальное время ожидания загрузки изображений (мс)
 * @returns {boolean} - true, если все изображения загружены или истекло максимальное время ожидания
 */
export const useImagesLoaded = (dependency: any, maxWaitTime: number = 10000): boolean => {
	const [imagesLoaded, setImagesLoaded] = useState(false);

	useEffect(() => {
		// Сбрасываем состояние при изменении зависимости
		setImagesLoaded(false);

		if (!dependency) return;

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
					); // Используем once: true для автоматического удаления обработчика

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
	}, [dependency, maxWaitTime]);

	return imagesLoaded;
};
