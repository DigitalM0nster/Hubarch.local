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

	const updateActiveItem = () => {
		const container = containerRef.current;
		if (!container) return;

		const items = container.querySelectorAll<HTMLElement>(`.${styles.imageItem}`);
		const containerCenter = container.scrollLeft + container.offsetWidth / 2;

		let closest: HTMLElement | null = null;
		let closestDistance = Infinity;

		items.forEach((item) => {
			const itemCenter = item.offsetLeft + item.offsetWidth / 2;
			const distance = Math.abs(itemCenter - containerCenter);

			if (distance < closestDistance) {
				closestDistance = distance;
				closest = item;
			}
		});

		items.forEach((item) => (item as HTMLElement).classList.remove(styles.active));
		if (closest) (closest as HTMLElement).classList.add(styles.active);
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
			setGalleryImages([...normalizedImages, ...normalizedImages, ...normalizedImages]);
		}
		// console.log(images, normalizedImages);
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

		// console.log(container.scrollLeft, oneThird);
		// если слишком далеко влево — переносим вправо на треть
		if (scrollLeft <= oneThird / 2) {
			container.scrollLeft += oneThird;
		}

		// если слишком далеко вправо — переносим влево на треть
		else if (scrollLeft > oneThird + oneThird / 2) {
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
							<img src={image.url} alt={`image-${index}`} draggable={false} />
							{image.caption && <div className={styles.description}>{image.caption}</div>}
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
