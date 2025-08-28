// src\app\[language]\approach\components\Screen1.tsx

import styles from "./styles.module.scss";
import parse from "html-react-parser";
import { useApproachPageStore } from "@/store/approachPageStore";
import { useWindowStore } from "@/store/windowStore";
import { useHudMenuStore } from "@/store/hudMenuStore";

interface Screen {
	title: string;
	text: string;
	image: string | false;
}

export default function Screen1({ language }: { language: string }) {
	const { data } = useApproachPageStore();
	const { isMobile } = useWindowStore();
	const { isTopBannerActive } = useHudMenuStore();
	if (!data) return <div>Данные не загружены</div>;

	return (
		<>
			{data.approach_page.screens_content.map((screen: Screen, index: number) => {
				return (
					<div
						key={`screen_${index}`}
						className={`screen approachScreen ${styles.approachScreen} ${index === 0 ? "active" : ""} ${
							isTopBannerActive ? styles.withTopBanner + " withTopBanner" : ""
						}`}
						data-screen-lightness="light"
						data-lines-index={isMobile ? 0 : 0}
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
							<div className={styles.textPart}>
								{screen.title != "" && (
									<div className={styles.titleBlock}>
										<div className={styles.number}>(0{index + 1})</div>
										<div className={styles.title}>{screen.title}</div>
									</div>
								)}
								{screen.text != "" && (
									<div className={styles.textBlock}>
										<div className={styles.icon}>
											<svg width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
												<path
													fillRule="evenodd"
													clipRule="evenodd"
													d="M0 0H27V27H20.6433L14.6163 21.0069L16.1296 19.5005L21.5296 24.8702H24.8593V2.12977H2.14066V24.8702H10.227V27H0V0Z"
													fill="var(--mainTextColor)"
												/>
											</svg>
										</div>
										<div className={styles.text}>{parse(screen.text)}</div>
									</div>
								)}
							</div>
							<div className={styles.imagePart}>
								<div className={styles.image}>
									{screen.image ? (
										<img src={screen.image} alt={`image_${index + 1}`} />
									) : (
										<img src="/images/approach/template_image.png" alt={`image_${index + 1}`} />
									)}
								</div>
							</div>
						</div>
					</div>
				);
			})}
		</>
	);
}
