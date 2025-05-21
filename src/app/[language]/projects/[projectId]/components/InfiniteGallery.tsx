"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./styles.module.scss";

interface Props {
	images: string[];
}

export default function InfiniteGallery({ images }: Props) {
	const containerRef = useRef<HTMLDivElement>(null);
	const galleryImages = [...images, ...images, ...images]; // 3 копии

	// const ITEM_WIDTH = 15 * 16; // 15vw approx in px — можно динамически
	const DUPLICATION_THRESHOLD = 3; // Когда остаётся 3 элемента до конца — дублируем

	let itemWidth = 0;

	const handleScroll = () => {
		const container = containerRef.current;
		if (!container) return;

		const totalWidth = images.length * itemWidth;
		const scrollLeft = container.scrollLeft;

		// если ушли слишком влево — прыгаем в центр
		if (scrollLeft < totalWidth * 0.5) {
			container.scrollLeft += totalWidth;
		}

		// если ушли слишком вправо — тоже прыгаем в центр
		if (scrollLeft > totalWidth * 2.5) {
			container.scrollLeft -= totalWidth;
		}
	};

	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		const item = container.querySelector(`.${styles.imageItem}`) as HTMLElement;
		if (item) {
			itemWidth = item.offsetWidth;
		}

		container.scrollLeft = images.length * itemWidth;

		const onScroll = () => {
			const totalWidth = images.length * itemWidth;
			const scrollLeft = container.scrollLeft;

			if (scrollLeft < totalWidth * 0.5) {
				container.scrollLeft += totalWidth;
			}
			if (scrollLeft > totalWidth * 2.5) {
				container.scrollLeft -= totalWidth;
			}
		};

		container.addEventListener("scroll", onScroll);
		return () => container.removeEventListener("scroll", onScroll);
	}, []);

	// Drag
	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		let isDown = false;
		let startX = 0;
		let scrollStart = 0;

		const onDown = (e: MouseEvent | TouchEvent) => {
			isDown = true;
			startX = "touches" in e ? e.touches[0].clientX : e.clientX;
			scrollStart = container.scrollLeft;
		};

		const onMove = (e: MouseEvent | TouchEvent) => {
			if (!isDown) return;
			const x = "touches" in e ? e.touches[0].clientX : e.clientX;
			const walk = x - startX;
			container.scrollLeft = scrollStart - walk;
		};

		const onUp = () => {
			isDown = false;
		};

		container.addEventListener("mousedown", onDown);
		container.addEventListener("mousemove", onMove);
		window.addEventListener("mouseup", onUp);

		container.addEventListener("touchstart", onDown, { passive: false });
		container.addEventListener("touchmove", onMove, { passive: false });
		window.addEventListener("touchend", onUp);

		return () => {
			container.removeEventListener("mousedown", onDown);
			container.removeEventListener("mousemove", onMove);
			window.removeEventListener("mouseup", onUp);

			container.removeEventListener("touchstart", onDown);
			container.removeEventListener("touchmove", onMove);
			window.removeEventListener("touchend", onUp);
		};
	}, []);

	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		const observer = new ResizeObserver(updateActiveItem);
		observer.observe(container);

		container.addEventListener("scroll", updateActiveItem);
		updateActiveItem(); // первый запуск

		function updateActiveItem() {
			const container = containerRef.current;
			if (!container) return; // ⬅️ защита от null

			const selector = `.${styles.imageItem as string}`;
			const items = container.querySelectorAll<HTMLElement>(selector);
			const center = container.scrollLeft + container.offsetWidth / 2;

			let closest: HTMLElement | null = null;
			let closestDistance = Infinity;

			items.forEach((item: HTMLElement) => {
				const box = item.getBoundingClientRect();
				const itemCenter = box.left + box.width / 2;
				const distance = Math.abs(itemCenter - container.offsetWidth / 2);

				if (distance < closestDistance) {
					closestDistance = distance;
					closest = item;
				}
			});

			items.forEach((item: HTMLElement) => item.classList.remove(styles.active));
			if (closest) {
				(closest as HTMLElement).classList.add(styles.active);
			}
		}

		return () => {
			container.removeEventListener("scroll", updateActiveItem);
			observer.disconnect();
		};
	}, []);

	return (
		<div className={styles.galleryWrapper}>
			<div className={styles.gallery} ref={containerRef}>
				{galleryImages.map((src, i) => (
					<div key={`${src}-${i}`} className={styles.imageItem}>
						<img src={src} alt={`img-${i}`} draggable={false} />
					</div>
				))}
			</div>
		</div>
	);
}
