import styles from "./styles.module.scss";
import { useMainPageStore } from "@/store/mainPageStore";
import { usePreloaderStore } from "@/store/preloaderStore";
import { useEffect, useRef, useState } from "react";
import LinkWithPreloader from "@/components/preloader/LinkWithPreloader";
import { useWindowStore } from "@/store/windowStore";
import { useAwardsAndProjectsStore } from "@/store/awardsAndProjectsStore";
import parse from "html-react-parser";

export default function AwardsScreen({ language, data }: { language: string; data: any }) {
	const { markReady } = usePreloaderStore();
	const { isMobile } = useWindowStore();

	const { structuredAwards, projectsList, awardsAndProjectsFetchingFinished, fetchAwardsAndProjects } = useAwardsAndProjectsStore();
	const [hoveredAwardId, setHoveredAwardId] = useState<number | null>(null);

	/* eslint-disable react-hooks/exhaustive-deps */
	useEffect(() => {
		if (awardsAndProjectsFetchingFinished) {
			markReady();
		}
	}, [awardsAndProjectsFetchingFinished]);

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

	/* eslint-enable react-hooks/exhaustive-deps */

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

																if (!slug) return null;

																return (
																	<LinkWithPreloader
																		key={`${year}-${index}`}
																		href={`/${language}/projects/${slug}`}
																		className={styles.award}
																		customMouseEnter={() => setHoveredAwardId(project.id)}
																		customMouseLeave={() => setHoveredAwardId(null)}
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
										<div className={styles.image}>
											<img src={project.acf?.project_preview || "/placeholder.jpg"} alt={project.title?.rendered || "Проект"} />
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
