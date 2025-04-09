// src\components\pages\mainPage\screen1.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./styles.module.scss";
import { useMainPageStore } from "@/store/mainPageStore";
import parse from "html-react-parser";
import { usePreloaderStore } from "@/store/preloaderStore";

export default function Screen1() {
	const data = useMainPageStore((state) => state.data?.main_page_screen1);
	const images = useMemo(() => data?.images || [], [data?.images]);
	const text = data?.text;

	const { markReady } = usePreloaderStore();

	// ОТМЕЧАЕМСЯ ДЛЯ ПРЕЛОАДЕРА

	/* eslint-disable react-hooks/exhaustive-deps */
	const alreadyMarked = useRef(false);

	useEffect(() => {
		if (data && !alreadyMarked.current) {
			alreadyMarked.current = true;
			markReady();
		}
	}, [data]);

	useEffect(() => {
		if (!alreadyMarked.current && data) {
			alreadyMarked.current = true;
			markReady();
		}
	}, []);

	/* eslint-enable react-hooks/exhaustive-deps */

	// Храним индекс активного изображения
	const [activeIndex, setActiveIndex] = useState(0);

	// Запускаем переключение картинок раз в 1 секунду
	useEffect(() => {
		if (images.length < 2) return; // Если изображение одно — ничего не делаем

		const interval = setInterval(() => {
			setActiveIndex((prevIndex) => (prevIndex + 1) % images.length);
		}, 300);

		return () => clearInterval(interval); // Очищаем интервал при размонтировании
	}, [images]);

	if (!data) return <div>Данные не загружены</div>;

	return (
		<div
			className={`screen active ${styles.screen1}`}
			data-screen-lightness="light"
			data-lines-index={1}
			data-mini-line-rotation={-45}
			data-position-x={50}
			data-position-y={50}
			data-horizontal-x={50}
			data-horizontal-width={100}
			data-vertical-height={100}
			data-lines-color={"dark"}
			data-left-line-x={0}
			data-left-line-height={0}
			data-right-line-x={100}
			data-right-line-height={0}
		>
			<div className={`screenContent ${styles.screenContent}`}>
				<div className={styles.imageBlock}>
					{images.length > 0 ? (
						images.map((img, index) => (
							<div className={`${styles.image} ${index === activeIndex ? styles.active : ""}`} key={`image${index}`}>
								<img src={img.url} alt={img.alt ? img.alt : img.name} />
							</div>
						))
					) : (
						<div className={styles.image}>Тут должно быть изображение</div>
					)}
				</div>
				{text && <div className={styles.textBlock}>{parse(text)}</div>}
			</div>
		</div>
	);
}
