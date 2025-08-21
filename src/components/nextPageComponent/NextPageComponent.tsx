"use client";

import styles from "./styles.module.scss";
import { usePreloaderStore } from "@/store/preloaderStore";
import { useEffect, useRef } from "react";
import LinkWithPreloader from "@/components/preloader/LinkWithPreloader";
import { useWindowStore } from "@/store/windowStore";
import parse from "html-react-parser";

export default function NextPageScreen({ language, data, text_is_light = false }: { language: string; data: any; text_is_light?: boolean }) {
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
				data-screen-lightness={text_is_light ? "dark" : "light"}
				data-lines-index={isMobile ? 0 : 1}
				data-mini-line-rotation={-45}
				data-position-x={isMobile ? 50 : 50}
				data-position-y={isMobile ? 50 : 33.3}
				data-horizontal-x={isMobile ? 50 : 50}
				data-horizontal-width={isMobile ? 100 : 100}
				data-vertical-height={isMobile ? 100 : 100}
				data-lines-color={text_is_light ? "light" : "dark"}
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
								<div className={styles.icon}>
									<svg xmlns="http://www.w3.org/2000/svg" width="21" height="22" viewBox="0 0 21 22" fill="none">
										<path
											fillRule="evenodd"
											clipRule="evenodd"
											d="M4.24669 17.2533C7.7003 20.7069 13.2997 20.7069 16.7533 17.2533C20.2069 13.7997 20.2069 8.2003 16.7533 4.74669C13.2997 1.29309 7.7003 1.29309 4.24669 4.74669C0.793087 8.2003 0.793087 13.7997 4.24669 17.2533ZM3.07538 18.4246C7.17588 22.5251 13.8241 22.5251 17.9246 18.4246C22.0251 14.3241 22.0251 7.67588 17.9246 3.57538C13.8241 -0.525126 7.17588 -0.525126 3.07538 3.57538C-1.02513 7.67588 -1.02513 14.3241 3.07538 18.4246Z"
											fill="var(--mainTextColor)"
										/>
										<path d="M10.0097 5.4841L15.6774 11.1517L14.5061 12.3231L8.8384 6.65541L10.0097 5.4841Z" fill="var(--mainTextColor)" />
										<path d="M15.6772 11.1516L10.0096 16.8193L8.83828 15.648L14.5059 9.98031L15.6772 11.1516Z" fill="var(--mainTextColor)" />
										<path d="M14.4709 11.8277H0.924743V10.1712H14.4709V11.8277Z" fill="var(--mainTextColor)" />
									</svg>
								</div>
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
