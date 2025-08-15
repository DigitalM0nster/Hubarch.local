"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./styles.module.scss";

interface Image {
	url: string;
	caption: string;
}

interface Props {
	images: Image[];
}

export default function InfiniteGallery({ images }: Props) {
	const containerRef = useRef<HTMLDivElement>(null);
	const itemWidthRef = useRef<number>(0);
	const [galleryImages, setGalleryImages] = useState<Image[]>([]);
	const isInfinite = images.length > 2;
	const MIN_ITEMS_FOR_SCROLL = 6;

	// Функция для скролла к конкретному изображению
	const scrollToImage = (clickedIndex: number) => {
		const container = containerRef.current;
		if (!container) return;

		// Логируем текущий скролл в момент клика
		const scrollAtClick = container.scrollLeft;
		console.log(`🎯 КЛИК ПО КАРТИНКЕ ${clickedIndex + 1}:`);
		console.log(`📊 Текущий скролл в момент клика: ${scrollAtClick}px`);

		// Получаем все элементы изображений
		const items = Array.from(container.querySelectorAll(`.${styles.imageItem}`)) as HTMLElement[];

		// Находим элемент, на который кликнули
		const targetItem = items[clickedIndex];
		if (!targetItem) return;

		// Рассчитываем позицию для скролла
		// Центрируем выбранное изображение в контейнере
		const containerWidth = container.offsetWidth;
		const itemWidth = targetItem.offsetWidth;
		const itemLeft = targetItem.offsetLeft;
		console.log(containerWidth, itemWidth, itemLeft);

		// Позиция для скролла: левый край изображения + половина ширины изображения - половина ширины контейнера
		const scrollPosition = itemLeft + itemWidth / 2 - containerWidth / 2;

		// Проверяем, нужно ли будет смещение после скролла
		const scrollWidth = container.scrollWidth;
		const oneThird = scrollWidth / 3;
		let willShift = false;
		let shiftDirection = "";
		let finalScrollPosition = scrollPosition;

		// Если скролл будет слишком далеко влево - будет смещение вправо
		if (scrollPosition <= oneThird / 2) {
			willShift = true;
			shiftDirection = "toRight";
			finalScrollPosition = scrollPosition + oneThird;
		}
		// Если скролл будет слишком далеко вправо - будет смещение влево
		else if (scrollPosition > oneThird + oneThird / 2) {
			willShift = true;
			shiftDirection = "toLeft";
			finalScrollPosition = scrollPosition - oneThird;
		}

		// Проверяем, нужно ли скроллить или сразу пропустить
		if (willShift) {
			console.log(`🔄 будет смещение ${shiftDirection}`);
			// Получаем gap между картинками
			// getComputedStyle может вернуть "normal", поэтому получаем gap из стилей
			const containerStyle = getComputedStyle(container);
			const gapValue = containerStyle.gap;

			// Если gap = "normal", получаем gap из первого элемента
			let gap = 0;
			if (gapValue === "normal" || gapValue === "0") {
				// Получаем gap из первого элемента галереи
				const firstItem = container.querySelector(`.${styles.imageItem}`) as HTMLElement;
				if (firstItem && firstItem.nextElementSibling) {
					const secondItem = firstItem.nextElementSibling as HTMLElement;
					gap = secondItem.offsetLeft - firstItem.offsetLeft - firstItem.offsetWidth;
				}
			} else {
				gap = parseFloat(gapValue);
			}

			const scrollDistance = (itemWidth + gap) * images.length; // Ширина картинки + gap

			// Скроллим влево на ширину одной картинки + gap
			const scrollLeftByOneImage = scrollAtClick - scrollDistance;
			const scrollRightByOneImage = scrollAtClick + scrollDistance;

			if (shiftDirection === "toLeft") {
				container.scrollTo({
					left: scrollLeftByOneImage,
				});
				container.scrollTo({
					left: scrollPosition - scrollDistance,
					behavior: "smooth",
				});
			} else {
				container.scrollTo({
					left: scrollRightByOneImage,
				});
				container.scrollTo({
					left: scrollPosition + scrollDistance,
					behavior: "smooth",
				});
			}
		} else {
			// Плавно скроллим к нужной позиции
			container.scrollTo({
				left: scrollPosition,
				behavior: "smooth",
			});
		}
	};

	// Обработчик клика на изображение
	const handleImageClick = (index: number) => {
		scrollToImage(index);
	};

	const updateActiveItem = () => {
		const container = containerRef.current;
		if (!container) return;

		// Явно приводим NodeList к массиву HTMLElement
		const items = Array.from(container.querySelectorAll(`.${styles.imageItem}`)) as HTMLElement[];

		const containerCenter = container.scrollLeft + container.offsetWidth / 2;

		let closestEl: HTMLElement | null = null;
		let closestDistance = Infinity;
		let closestIndex = -1;

		items.forEach((item, index) => {
			const itemCenter = item.offsetLeft + item.offsetWidth / 2;
			const distance = Math.abs(itemCenter - containerCenter);

			if (distance < closestDistance) {
				closestDistance = distance;
				closestEl = item;
				closestIndex = index;
			}
		});

		items.forEach((item) => item.classList.remove(styles.active));

		if (closestEl && closestIndex !== -1) {
			(closestEl as HTMLElement).classList.add(styles.active);

			// Исправляем логику: используем длину исходных изображений, а не normalizedImages
			const originalImageIndex = closestIndex % images.length;

			items.forEach((item, index) => {
				if (index % images.length === originalImageIndex) {
					item.classList.add(styles.active);
				}
			});
		}
	};

	const normalizedImages = useMemo(() => {
		if (!isInfinite) return images;

		let result = [...images];
		while (result.length < MIN_ITEMS_FOR_SCROLL) {
			result = [...result, ...images];
		}

		return result;
	}, [images, isInfinite]);

	// 1. Собираем галерею из 3 частей: левая копия + оригинал + правая копия
	useEffect(() => {
		if (!isInfinite) {
			setGalleryImages(images);
		} else {
			const finalGallery = [...normalizedImages, ...normalizedImages, ...normalizedImages];
			setGalleryImages(finalGallery);
		}
	}, [normalizedImages, images, isInfinite]);

	// 2. Инициализация скролла и ширины
	useEffect(() => {
		if (!containerRef.current) return;

		const container = containerRef.current;
		const firstItem = container.querySelector(`.${styles.imageItem}`) as HTMLElement;
		if (!isInfinite || !firstItem) return;

		let gap = 0;

		if (firstItem) {
			gap = parseFloat(getComputedStyle(container).gap || "0");
			itemWidthRef.current = firstItem.offsetWidth + gap;
		}

		if (normalizedImages.length >= MIN_ITEMS_FOR_SCROLL && firstItem) {
			requestAnimationFrame(() => {
				const items = container.querySelectorAll<HTMLElement>(`.${styles.imageItem}`);
				const indexOfFirstOriginal = normalizedImages.length;
				const targetItem = items[indexOfFirstOriginal];

				if (!targetItem) return;
				const containerRect = container.getBoundingClientRect();

				// Центр нужного элемента минус центр контейнера
				const delta = targetItem.offsetLeft + targetItem.offsetWidth / 2 - containerRect.width / 2;

				container.scrollLeft = delta;

				updateActiveItem();
			});
		}
	}, [galleryImages, normalizedImages]);

	// 3. Реакция на прокрутку — прыгаем в центр при приближении к краям
	const handleScroll = () => {
		const container = containerRef.current;
		if (!container) return;
		if (!isInfinite || images.length <= 2) return;

		const scrollLeft = container.scrollLeft;
		const scrollWidth = container.scrollWidth;
		const oneThird = scrollWidth / 3;

		// Логируем текущий скролл при прокрутке
		console.log(`🔄 Текущий скролл: ${scrollLeft}px`);

		// если слишком далеко влево — переносим вправо на треть
		if (scrollLeft <= oneThird / 2) {
			console.log(`⬅️ Смещение вправо на ${oneThird}px`);
			container.scrollLeft += oneThird;
		}

		// если слишком далеко вправо — переносим влево на треть
		else if (scrollLeft > oneThird + oneThird / 2) {
			console.log(`➡️ Смещение влево на ${oneThird}px`);
			container.scrollLeft -= oneThird;
		}

		// центрируем активный
		updateActiveItem();
	};

	// 4. Drag scroll
	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;
		if (!isInfinite) return;

		let isDragging = false;
		let startX = 0;
		let scrollStart = 0;

		const onDown = (e: MouseEvent | TouchEvent) => {
			isDragging = true;
			startX = "touches" in e ? e.touches[0].clientX : e.clientX;
			scrollStart = container.scrollLeft;
		};

		const onMove = (e: MouseEvent | TouchEvent) => {
			if (!isDragging) return;
			const x = "touches" in e ? e.touches[0].clientX : e.clientX;
			container.scrollLeft = scrollStart - (x - startX);
		};

		const onUp = () => {
			isDragging = false;
		};

		container.addEventListener("mousedown", onDown);
		container.addEventListener("mousemove", onMove);
		window.addEventListener("mouseup", onUp);

		container.addEventListener("touchstart", onDown, { passive: false });
		container.addEventListener("touchmove", onMove, { passive: false });
		window.addEventListener("touchend", onUp);

		container.addEventListener("scroll", handleScroll);

		return () => {
			container.removeEventListener("mousedown", onDown);
			container.removeEventListener("mousemove", onMove);
			window.removeEventListener("mouseup", onUp);

			container.removeEventListener("touchstart", onDown);
			container.removeEventListener("touchmove", onMove);
			window.removeEventListener("touchend", onUp);

			container.removeEventListener("scroll", handleScroll);
		};
	}, [images]);

	return (
		<div className={`${styles.galleryWrapper} ${!isInfinite ? styles.soloImage : ""}`}>
			<div className={styles.gallery} ref={containerRef}>
				{galleryImages.map((image, index) => (
					<div key={`${image.url}-${index}`} className={styles.imageItem}>
						<div className={styles.imageBlock}>
							<img src={image.url} alt={`image-${index}`} draggable={false} onClick={() => handleImageClick(index)} />
							{image.caption && <div className={styles.description}>{image.caption}</div>}
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
