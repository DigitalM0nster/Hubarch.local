"use client";

import styles from "./styles.module.scss";
import { usePreloaderStore } from "@/store/preloaderStore";
import { useEffect, useRef } from "react";
import LinkWithPreloader from "@/components/preloader/LinkWithPreloader";
import { useWindowStore } from "@/store/windowStore";
import parse from "html-react-parser";

export default function NextPageScreen({ language, data }: { language: string; data: any }) {
	const { isMobile } = useWindowStore();
	const { addCachedImage, setIsProjectLoading, setProjectImage, setImageRect } = usePreloaderStore();
	const imageRef = useRef<HTMLDivElement>(null);

	// Функция для получения размеров изображения
	const getImageRect = () => {
		if (!imageRef.current) return null;
		return imageRef.current?.getBoundingClientRect();
	};

	useEffect(() => {
		if (data.image != false) {
			addCachedImage({ src: data.image });
		}
	}, [data]);

	return (
		<>
			<div
				className={`screen nextPageScreen ${styles.nextPageScreen}`}
				data-screen-lightness="light"
				data-lines-index={isMobile ? 0 : 1}
				data-mini-line-rotation={-45}
				data-position-x={isMobile ? 50 : 50}
				data-position-y={isMobile ? 50 : 33.3}
				data-horizontal-x={isMobile ? 50 : 50}
				data-horizontal-width={isMobile ? 100 : 100}
				data-vertical-height={isMobile ? 100 : 100}
				data-lines-color={"dark"}
				data-left-line-x={0}
				data-left-line-height={0}
				data-right-line-x={100}
				data-right-line-height={0}
			>
				<div className={`screenContent ${styles.screenContent}`}>
					<LinkWithPreloader
						href={data.link.url}
						className={styles.imageBlock}
						customClick={() => {
							if (data.link.url.includes("projects")) {
								// Получаем размеры и позицию изображения
								const localImageRect = getImageRect();

								// Исправление ширины изображения если необходимо
								if (imageRef.current) {
									imageRef.current.style.width = "100%";
								}

								// Сохраняем информацию о размерах в store
								if (localImageRect) {
									setImageRect({
										x: localImageRect.x + "px",
										y: localImageRect.y + "px",
										width: localImageRect.width + "px",
										height: localImageRect.height + "px",
										top: localImageRect.top + "px",
										right: localImageRect.right + "px",
										bottom: localImageRect.bottom + "px",
										left: localImageRect.left + "px",
										opacity: 0,
										transition: "all 0s 0s",
										innerImageWidth: "100%",
										innerImageHeight: "100%",
										progressLineTransition: "all 0.25s 1s",
										progressTransition: "all 0.25s 1s",
									});

									setTimeout(() => {
										setImageRect({
											x: `calc((100% - var(--contentWidth)) * 0.5)`,
											y: `calc(var(--screenPadding) * 4)`,
											width: `var(--contentWidth)`,
											height:
												window.innerWidth <= 980
													? `calc(100% - var(--screenPadding) * 2 - var(--logoMaxHeight) - 50px - 30px)`
													: window.innerWidth > 1680
													? "calc(100% - var(--screenPadding) * 4 * 2 - 50px - 20px)"
													: `calc(100% - var(--screenPadding) * 3 * 2 - 50px - 20px)`,
											top:
												window.innerWidth <= 980
													? `var(--screenPadding)`
													: window.innerWidth > 1680
													? "calc(var(--screenPadding) * 4)"
													: `calc(var(--screenPadding) * 3)`,
											right: `calc((100% - var(--contentWidth)) * 0.5)`,
											bottom:
												window.innerWidth <= 980
													? `var(--screenPadding)`
													: window.innerWidth > 1680
													? "calc(var(--screenPadding) * 4)"
													: `calc(var(--screenPadding) * 3)`,
											left: `calc((100% - var(--contentWidth)) * 0.5)`,
											opacity: 1,
											transition: "all 0.25s 0.3s, opacity 0s 0s",
											innerImageWidth: "100%",
											innerImageHeight: "100%",
											progressLineTransition: "all 0.5s 0.55s",
											progressTransition: "all 0.3s 0.7s",
										});
									}, 0);
								}

								// Устанавливаем состояние загрузки проекта и изображение для прелоадера
								setIsProjectLoading(true);
								setProjectImage(data.image !== false ? data.image : "/images/next_page_template.png");
							}
						}}
					>
						<div className={styles.image} ref={imageRef}>
							<img src={data.image != false ? data.image : "/images/next_page_template.png"} alt="" />
						</div>
						<div className={styles.buttonBlock}>
							<div className={styles.button}>
								<div className={styles.icon} />
								<div className={styles.text}>{language === "ru" ? "Перейти" : "Go to"}</div>
							</div>
							<div className={styles.pageName}>{data.link.title}</div>
						</div>
					</LinkWithPreloader>
					{data.text && <div className={styles.textBlock}>{parse(data.text)}</div>}
				</div>
			</div>
		</>
	);
}
