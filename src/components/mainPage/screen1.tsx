import { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import { useMainPageStore } from "@/store/mainPageStore";
import parse from "html-react-parser";
import { preloaderStore } from "@/store/preloaderStore";

export default function Screen1() {
	const data = useMainPageStore((state) => state.data?.main_page_screen1);
	const images = data?.images || [];
	const text = data?.text;

	// ОТМЕЧАЕМСЯ ДЛЯ ПРЕЛОАДЕРА
	useEffect(() => {
		preloaderStore.markReady();
	}, []);

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
			data-position-z={50}
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
