import styles from "./styles.module.scss";
import { useMainPageStore } from "@/store/mainPageStore";
import { usePreloaderStore } from "@/store/preloaderStore";
import { useEffect, useRef, useState } from "react";
import LinkWithPreloader from "@/components/preloader/LinkWithPreloader";
import { useWindowStore } from "@/store/windowStore";
import { useAwardsAndProjectsStore } from "@/store/awardsAndProjectsStore";
import parse from "html-react-parser";

export default function AwardsScreen({ language, data }: { language: string; data: any }) {
	const { isMobile } = useWindowStore();

	const { structuredAwards, projectsList, fetchAwardsAndProjects } = useAwardsAndProjectsStore();
	const { setIsProjectLoading, setProjectImage, setImageRect } = usePreloaderStore();
	const [hoveredAwardId, setHoveredAwardId] = useState<number | null>(null);

	// Создаем объект для хранения ссылок на изображения проектов
	const imageRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

	// Функция для получения размеров изображения конкретного проекта
	const getImageRect = (projectId: number) => {
		if (!imageRefs.current[projectId]) return null;
		return imageRefs.current[projectId]?.getBoundingClientRect();
	};

	useEffect(() => {
		fetchAwardsAndProjects(language);
	}, []);

	const totalNominationsCount = structuredAwards.reduce((sum, { years }) => {
		return sum + Object.values(years).reduce((acc, nominations) => acc + nominations.length, 0);
	}, 0);

	function getPlural(count: number, one: string, few: string, many: string) {
		const mod10 = count % 10;
		const mod100 = count % 100;

		if (mod10 === 1 && mod100 !== 11) return one;
		if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few;
		return many;
	}

	return (
		<>
			<div
				className={`screen awardsScreen ${styles.awardsScreen}`}
				data-screen-lightness="light"
				data-lines-index={isMobile ? 1 : 1}
				data-mini-line-rotation={-45}
				data-position-x={isMobile ? 50 : 25}
				data-position-y={50}
				data-horizontal-x={isMobile ? 50 : 25}
				data-horizontal-width={isMobile ? 100 : 50}
				data-vertical-height={isMobile ? 100 : 75}
				data-lines-color={"dark"}
				data-left-line-x={0}
				data-left-line-height={0}
				data-right-line-x={100}
				data-right-line-height={0}
			>
				<div className={`screenContent ${styles.screenContent}`}>
					<div className={`topBlock ${styles.topBlock}`}>
						<div className={styles.number}>({totalNominationsCount})</div>
						<div className={styles.text}>{getPlural(totalNominationsCount, "Премия", "Премии", "Премий")}</div>
					</div>
					<div className={`leftBlock ${styles.leftBlock}`}>
						<div className={`titleBackground titleBackgroundColor ${styles.titleBackgroundColor}`}>{totalNominationsCount}</div>
						{data?.title_background && <div className={`titleBackground ${styles.titleBackground}`}>{data.title_background}</div>}
						{data?.text && <div className={`text ${styles.text}`}>{parse(data.text)}</div>}
					</div>
					<div className={`rightBlock ${styles.rightBlock} noScreenScrollZone`}>
						<div className={`${styles.awardItemsList} scrollable`}>
							{structuredAwards.map((awardEntry) => {
								return (
									<div key={awardEntry.id} className={styles.awardItem}>
										<div className={styles.awardCategoryBlock}>
											<div className={styles.image} style={{ backgroundColor: awardEntry.acf?.award_background_color || "white" }}>
												<img src={awardEntry.acf?.award_image} alt={awardEntry.name} />
											</div>
											<div className={styles.title}>{awardEntry.name}</div>
										</div>

										{Object.entries(awardEntry.years)
											.sort((a, b) => Number(b[0]) - Number(a[0]))
											.map(([year, data]) => {
												return (
													<div key={year} className={styles.awardYearBlock}>
														<div className={styles.year}>{year}</div>
														<div className={styles.awardsList}>
															{data.map((nom, index) => {
																const project = nom.project;
																const slug = project?.slug;
																const acf = project?.acf;

																if (!slug) return null;

																return (
																	<LinkWithPreloader
																		key={`${year}-${index}`}
																		href={`/${language}/projects/${slug}`}
																		className={styles.award}
																		customMouseEnter={() => setHoveredAwardId(project.id)}
																		customMouseLeave={() => setHoveredAwardId(null)}
																		customClick={() => {
																			// Получаем размеры и позицию изображения для конкретного проекта
																			const projectId = project.id;
																			const localImageRect = getImageRect(projectId);
																			console.log("Image rect for project", projectId, localImageRect);

																			// Исправление ошибки с опциональным оператором доступа
																			if (imageRefs.current[projectId]) {
																				imageRefs.current[projectId]!.style.width = "100%";
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
																			setProjectImage(
																				acf.project_preview !== false ? acf.project_preview : "/images/projects/placeholder_big.png"
																			);
																		}}
																	>
																		<div className={styles.linkIcon} />
																		<div className={styles.text}>{nom.nomination}</div>
																	</LinkWithPreloader>
																);
															})}
														</div>
													</div>
												);
											})}
									</div>
								);
							})}
						</div>
						<div className={styles.projectsList}>
							{projectsList.map((project: any, index) => {
								const isActive = hoveredAwardId === project.id;
								return (
									<div key={`projectItem${project.id} ${index}`} className={`${styles.projectItem} ${isActive ? styles.active : ""}`}>
										<div
											className={styles.image}
											ref={(el) => {
												imageRefs.current[project.id] = el;
											}}
										>
											<img src={project.acf?.project_preview || "/images/projects/placeholder_big.png"} alt={project.title?.rendered || "Проект"} />
										</div>
										<div className={styles.name}>
											<div className={styles.text}>{project.title?.rendered}</div>
										</div>
									</div>
								);
							})}
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
