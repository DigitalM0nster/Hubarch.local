import styles from "./styles.module.scss";
import { useMainPageStore } from "@/store/mainPageStore";
import { usePreloaderStore } from "@/store/preloaderStore";
import { useEffect, useRef, useState } from "react";
import LinkWithPreloader from "@/components/preloader/LinkWithPreloader";
import { useWindowStore } from "@/store/windowStore";
import { useAwardsAndProjectsStore } from "@/store/awardsAndProjectsStore";

export default function Screen4({ language }: { language: string }) {
	const { markReady } = usePreloaderStore();
	const { isMobile } = useWindowStore();

	const data = useMainPageStore((state) => state.data?.main_page_screen4);
	const { awardsByCategory, projectsList } = useAwardsAndProjectsStore();
	const [hoveredAwardId, setHoveredAwardId] = useState<number | null>(null);

	/* eslint-disable react-hooks/exhaustive-deps */
	useEffect(() => {
		if (data) {
			markReady();
		}
	}, [data]);

	const totalAwardsCount = awardsByCategory.reduce((sum, { awardsByYear }) => {
		return sum + Object.values(awardsByYear).reduce((acc, awards) => (acc as number) + awards.length, 0);
	}, 0);

	function getPlural(count: number, one: string, few: string, many: string) {
		const mod10 = count % 10;
		const mod100 = count % 100;

		if (mod10 === 1 && mod100 !== 11) return one;
		if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few;
		return many;
	}

	/* eslint-enable react-hooks/exhaustive-deps */

	return (
		<>
			<div
				className={`screen ${styles.screen4}`}
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
					<div className={styles.topBlock}>
						<div className={styles.number}>({totalAwardsCount})</div>
						<div className={styles.text}>{getPlural(totalAwardsCount, "Премия", "Премии", "Премий")}</div>
					</div>
					<div className={styles.leftBlock}>
						<div className={`titleBackground ${styles.titleBackgroundColor}`}>{totalAwardsCount}</div>
						{data?.title_background && <div className={`titleBackground ${styles.titleBackground}`}>{data.title_background}</div>}
						{data?.text && <div className={`${styles.text}`}>{data.text}</div>}
					</div>
					<div className={`${styles.rightBlock} noScreenScrollZone`}>
						<div className={`${styles.awardItemsList} scrollable`}>
							{awardsByCategory.map(({ category, awardsByYear }) => {
								return (
									<div key={category.id} className={styles.awardItem}>
										<div className={styles.awardCategoryBlock}>
											<div className={styles.image}>
												<img src={category.acf.category_award_image} alt={category.name} />
											</div>
											<div className={styles.title}>{category.name}</div>
										</div>
										{Object.entries(awardsByYear)
											.sort((a, b) => Number(b[0]) - Number(a[0]))
											.map(([year, awards]) => (
												<div key={year} className={styles.awardYearBlock}>
													<div className={styles.year}>{year}</div>
													<div className={styles.awardsList}>
														{awards.map((award: any) => {
															const projectId = award.acf.award_project;
															const project = projectsList.find((p) => p.id === projectId);
															const projectSlug = project?.slug;

															const projectSlugDefault = award._embedded?.["acf:post"]?.[0]?.slug;
															return projectSlugDefault ? (
																<LinkWithPreloader
																	key={award.id}
																	href={`/${language}/projects/${projectSlugDefault}`}
																	className={styles.award}
																	customMouseEnter={() => setHoveredAwardId(award.id)}
																	customMouseLeave={() => setHoveredAwardId(null)}
																>
																	<div className={styles.linkIcon} />
																	<div className={styles.text}>{award.title.rendered}</div>
																</LinkWithPreloader>
															) : (
																<LinkWithPreloader
																	key={award.id}
																	href={`/${language}/projects/${projectSlug}`}
																	className={styles.award}
																	customMouseEnter={() => setHoveredAwardId(award.id)}
																	customMouseLeave={() => setHoveredAwardId(null)}
																>
																	<div className={styles.linkIcon} />
																	<div className={styles.text}>{award.title.rendered}</div>
																</LinkWithPreloader>
															);
														})}
													</div>
												</div>
											))}
									</div>
								);
							})}
						</div>
						<div className={styles.projectsList}>
							{projectsList.map((project: any, index) => {
								const awards = project.acf?.project_awards;
								const isActive = Array.isArray(awards) && awards.some((award: any) => award.ID === hoveredAwardId);
								return (
									<div key={`projectItem${project.id} ${index}`} className={`${styles.projectItem} ${isActive ? styles.active : ""}`}>
										<div className={styles.image}>
											<img src={project.acf?.project_preview || "/placeholder.jpg"} alt={project.title?.rendered || "Проект"} />
										</div>
										<div className={styles.name}>
											<div className={styles.linkIcon} />
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
