"use client";

import { useEffect, useRef, useState } from "react";
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

	const MIN_ITEMS_FOR_SCROLL = 4;

	const updateActiveItem = () => {
		const container = containerRef.current;
		if (!container) return;

		const items = container.querySelectorAll<HTMLElement>(`.${styles.imageItem}`);
		const containerCenter = container.scrollLeft + container.offsetWidth / 2;

		let closest: HTMLElement | null = null;
		let closestDistance = Infinity;

		items.forEach((item) => {
			const rect = item.getBoundingClientRect();
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

	// 1. Собираем галерею из 3 частей: левая копия + оригинал + правая копия
	useEffect(() => {
		if (images.length < MIN_ITEMS_FOR_SCROLL) {
			setGalleryImages(images);
		} else {
			setGalleryImages([...images, ...images, ...images]);
		}
	}, [images]);

	// 2. Инициализация скролла и ширины
	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		const firstItem = container.querySelector(`.${styles.imageItem}`) as HTMLElement;
		let gap = 0;
		if (firstItem) {
			gap = parseFloat(getComputedStyle(container).gap || "0");
			itemWidthRef.current = firstItem.offsetWidth + gap;
		}

		// if (images.length >= MIN_ITEMS_FOR_SCROLL && firstItem) {
		// 	requestAnimationFrame(() => {
		// 		console.log(firstItem.offsetWidth);
		// 		container.scrollLeft = firstItem.offsetWidth * 0.5 + gap;
		// 		console.log(container.scrollLeft);
		// 		updateActiveItem();
		// 	});
		// }
		if (images.length >= MIN_ITEMS_FOR_SCROLL && firstItem) {
			requestAnimationFrame(() => {
				const itemWidth = firstItem.offsetWidth + gap;
				const indexOfFirstOriginal = images.length;

				// Центруем элемент: отступ до начала + пол элемента - пол контейнера
				const scrollTo = indexOfFirstOriginal * itemWidth + itemWidth / 2 - container.getBoundingClientRect().width / 2 - gap / 2;

				container.scrollLeft = scrollTo;
				updateActiveItem();
			});
		}
	}, [galleryImages]);

	// 3. Реакция на прокрутку — прыгаем в центр при приближении к краям
	const handleScroll = () => {
		const container = containerRef.current;
		if (!container || images.length < MIN_ITEMS_FOR_SCROLL) return;

		const scrollLeft = container.scrollLeft;
		const scrollWidth = container.scrollWidth;
		const oneThird = scrollWidth / 3;

		console.log(scrollLeft, oneThird);
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
		<div className={styles.galleryWrapper}>
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
