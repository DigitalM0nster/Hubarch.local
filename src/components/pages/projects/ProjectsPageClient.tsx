// src\components\pages\projects\ProjectsPageClient.tsx

"use client";

import styles from "./styles.module.scss";
import { useEffect, useRef, useState } from "react";
import { usePreloaderStore } from "@/store/preloaderStore";
import { useDetectMobile } from "@/hooks/useDetectMobile";
import { useScrollStore } from "@/store/scrollStore";
import { useAreaRangeStore } from "@/store/areaRangeStore";
import { useProjectsPageStore } from "@/store/projectsPageStore";
import { useScreenInit } from "@/hooks/useScreenInit";
import LinkWithPreloader from "@/components/preloader/LinkWithPreloader";
import { useAllProjectsStore } from "@/store/allProjectsStore";
import { useProjectTypesStore } from "@/store/projectTypesStore";
import ProjectsFilters from "./projectFilters";
import { useWindowStore } from "@/store/windowStore";

export default function ProjectsPageClient({ language }: { language: string }) {
	useScreenInit();
	useDetectMobile();
	const { fetchAllProjects, projectsList } = useAllProjectsStore();
	const { fetchProjectTypes, projectTypes } = useProjectTypesStore();
	const { data, fetchData } = useProjectsPageStore();
	const { fetchRanges, ranges } = useAreaRangeStore();
	const { setTotal, markReady } = usePreloaderStore();
	const { scrollAllowed } = useScrollStore();
	const { isMobile, windowWidth } = useWindowStore();

	const [visibleMobileFilters, setVisibleMobileFilters] = useState(false);

	// DRAGGING
	const listRef = useRef<HTMLDivElement>(null);
	const startX = useRef(0);
	const isDragging = useRef(false);
	const [dragOffset, setDragOffset] = useState(0);
	//

	// Состояния фильтров
	const [selectedTypes, setSelectedTypes] = useState<number[]>([]);
	const [selectedRanges, setSelectedRanges] = useState<{ min: number; max: number }[]>([]);

	// Активный проект
	const [activeProjectIndex, setActiveProjectIndex] = useState(0);

	// Функция фильтрации
	const filteredProjects = projectsList.filter((project) => {
		const matchesType = selectedTypes.length === 0 || project.acf.project_type.some((type) => selectedTypes.includes(type.term_id));

		const footage = parseInt(project.acf.project_footage || "0", 10);
		const matchesRange = selectedRanges.length === 0 || selectedRanges.some((range) => footage >= range.min && footage <= range.max);

		return matchesType && matchesRange;
	});

	/* eslint-disable react-hooks/exhaustive-deps */
	useEffect(() => {
		fetchData(language);
		fetchAllProjects(language);
		fetchProjectTypes(language);
		fetchRanges();
	}, []);

	useEffect(() => {
		if (projectsList.length > 0 && ranges.length > 0 && projectTypes.length > 0 && data) {
			markReady();
		}
	}, [projectsList, ranges, language, projectTypes, data]);

	// Включаем тот проект, который имеется
	useEffect(() => {
		if (activeProjectIndex > filteredProjects.length - 1) {
			setActiveProjectIndex(Math.max(filteredProjects.length - 1, 0));
		}
	}, [filteredProjects.length]);
	/* eslint-enable react-hooks/exhaustive-deps */

	// Указываем сколько компонентов должно отметиться
	useEffect(() => {
		const timeout = setTimeout(() => {
			setTotal(1);
		}, 0);

		return () => clearTimeout(timeout);
	}, [setTotal]);

	useEffect(() => {
		let timeout: NodeJS.Timeout | null = null;

		const handleWheel = (e: WheelEvent) => {
			// не трогаем мобильные
			if (isMobile) return;

			// дебаунс, чтобы не летало слишком быстро
			if (timeout) return;

			timeout = setTimeout(() => {
				timeout = null;
			}, 200); // скорость смены по скроллу

			if (e.deltaY > 0) {
				// скролл вниз
				setActiveProjectIndex((prev) => Math.min(prev + 1, filteredProjects.length - 1));
			} else if (e.deltaY < 0) {
				// скролл вверх
				setActiveProjectIndex((prev) => Math.max(prev - 1, 0));
			}
		};

		const handleKeyDown = (e: KeyboardEvent) => {
			if (isMobile) return;

			if (e.key === "ArrowDown") {
				setActiveProjectIndex((prev) => Math.min(prev + 1, filteredProjects.length - 1));
			} else if (e.key === "ArrowUp") {
				setActiveProjectIndex((prev) => Math.max(prev - 1, 0));
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		window.addEventListener("wheel", handleWheel);
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
			window.removeEventListener("wheel", handleWheel);
		};
	}, [filteredProjects.length, windowWidth]);

	//
	useEffect(() => {
		if (!isMobile || !listRef.current) return;

		const container = listRef.current;

		const handleTouchStart = (e: TouchEvent) => {
			isDragging.current = true;
			startX.current = e.touches[0].clientX;
		};

		const handleTouchMove = (e: TouchEvent) => {
			if (!isDragging.current) return;
			const delta = e.touches[0].clientX - startX.current;
			setDragOffset(delta);
		};

		const handleTouchEnd = () => {
			isDragging.current = false;

			if (!container) return;

			const cards = container.querySelectorAll(`.${styles.projectCard}`);
			const containerRect = container.getBoundingClientRect();
			const centerX = containerRect.left + containerRect.width / 2;

			let closestIndex = 0;
			let closestDistance = Infinity;

			cards.forEach((card, index) => {
				const rect = card.getBoundingClientRect();
				const cardCenter = rect.left + rect.width / 2;
				const distance = Math.abs(centerX - cardCenter);
				// console.log(cardCenter);

				if (distance < closestDistance) {
					closestDistance = distance;
					closestIndex = index;
				}
			});

			setActiveProjectIndex(closestIndex);
			setDragOffset(0);
		};

		container.addEventListener("touchstart", handleTouchStart);
		container.addEventListener("touchmove", handleTouchMove);
		container.addEventListener("touchend", handleTouchEnd);

		return () => {
			container.removeEventListener("touchstart", handleTouchStart);
			container.removeEventListener("touchmove", handleTouchMove);
			container.removeEventListener("touchend", handleTouchEnd);
		};
	}, [isMobile, filteredProjects.length]);
	//

	return (
		<>
			<div className={`screenScroll ${scrollAllowed === true ? "" : "noScroll"}`}>
				<div
					className={`screen active ${styles.screen}`}
					data-screen-lightness="dark"
					data-lines-index={1}
					data-mini-line-rotation={-45}
					data-position-x={50}
					data-position-y={50}
					data-horizontal-x={50}
					data-horizontal-width={100}
					data-vertical-height={isMobile ? 80 : 100}
					data-lines-color={"light"}
					data-left-line-x={10}
					data-left-line-height={isMobile ? 0 : 80}
					data-right-line-x={90}
					data-right-line-height={isMobile ? 0 : 80}
				>
					<div className={`screenContent ${styles.screenContent}`}>
						<div className={styles.leftBlock} ref={listRef}>
							<div className={`${styles.frame} ${filteredProjects.length < 1 ? styles.hidden : ""}`}>
								<div className={`${styles.line} ${styles.top}`} />
								<div className={`${styles.line} ${styles.right}`} />
								<div className={`${styles.line} ${styles.bottom}`} />
								<div className={`${styles.line} ${styles.left}`} />
							</div>
							<div
								className={`${styles.projectsList} ${filteredProjects.length < 1 ? styles.noProjects : ""}`}
								style={{
									transform: `${
										!isMobile
											? `translateY(calc((var(--projectCardHeight) * -0.5) - (var(--projectCardHeight) + var(--projectsGap)) * ${activeProjectIndex}))`
											: `translate(calc(${dragOffset}px + (var(--projectCardWidth) * -0.5) - (var(--projectCardWidth) + var(--projectsGap)) * ${activeProjectIndex}), -50%)`
									}`,
									transition: isDragging.current ? "none" : "transform 0.3s ease",
									touchAction: "pan-y", // чтоб не блокировался свайп
								}}
							>
								{projectsList.length > 0 ? (
									filteredProjects.map((project, index) => {
										return (
											<div
												key={index}
												className={`${styles.projectCard} ${activeProjectIndex === index ? styles.active : ""}`}
												onClick={() => {
													setActiveProjectIndex(index);
												}}
											>
												<img src={project.acf.project_preview} alt={project.title.rendered} />
											</div>
										);
									})
								) : (
									<div className={`${styles.projectCard} ${styles.active}`}>
										<img src={"/images/projects/placeholder.png"} alt="" />
									</div>
								)}
							</div>
						</div>
						<div className={`${styles.centerBlock} ${filteredProjects.length < 1 ? styles.noProjects : ""}`}>
							<div
								className={styles.projectsItems}
								style={{
									transform: `translateY(calc((var(--projectItemHeight) + var(--projectItemsGap)) * -${activeProjectIndex})`,
								}}
							>
								{projectsList.length > 0 ? (
									filteredProjects.length > 0 ? (
										filteredProjects.map((project, index) => {
											return (
												<LinkWithPreloader
													href={project.link}
													key={`project${index}`}
													className={`${styles.projectItem} ${activeProjectIndex === index ? styles.active : ""} ${
														activeProjectIndex > index ? styles.prev : ""
													}`}
												>
													<div className={styles.image}>
														<img src={project.acf.project_preview} alt={project.title.rendered} />
													</div>
													<div className={styles.aboutProject}>
														<div className={styles.buttonBlock}>
															<div className={styles.button}>
																<div className={styles.text}>Подробнее</div>
																<div className={styles.icon} />
															</div>
														</div>
														<div className={styles.projectName}>{project.title.rendered}</div>
														<div className={styles.projectFootage}>
															{project.acf.project_footage
																? language === "ru"
																	? `${project.acf.project_footage}м²`
																	: `${project.acf.project_footage}m²`
																: ""}
														</div>
													</div>
												</LinkWithPreloader>
											);
										})
									) : (
										<div className={`${styles.projectItem} ${styles.active} ${styles.placeholder}`}>
											<div className={styles.image}>
												<img src="/images/projects/placeholder_big.png" alt="" />
											</div>
											<div className={styles.aboutProject}>
												<div className={styles.buttonBlock}>
													<div className={styles.button}>
														<div className={styles.text}></div>
														<div className={styles.icon} />
													</div>
												</div>
												<div className={styles.projectName}>
													<div className={styles.text}>
														{language === "ru" ? "Нет проектов по заданным фильтрам" : "There are no projects matching the specified filters."}
													</div>
													<div
														className={styles.button}
														onClick={() => {
															setSelectedTypes([]);
															setSelectedRanges([]);
														}}
													>
														{language === "ru" ? "Сбросить" : "Reset filters"}
													</div>
												</div>
												<div className={styles.projectFootage}></div>
											</div>
										</div>
									)
								) : (
									<div className={`${styles.projectItem} ${styles.active} ${styles.placeholder}`}>
										<div className={styles.image}>
											<img src="/images/projects/placeholder_big.png" alt="" />
										</div>
										<div className={styles.aboutProject}>
											<div className={styles.buttonBlock}>
												<div className={styles.button}>
													<div className={styles.text}></div>
													<div className={styles.icon} />
												</div>
											</div>
											<div className={styles.projectName}>{language === "ru" ? "Проекты на загружены" : "Projects not loaded"}</div>
											<div className={styles.projectFootage}></div>
										</div>
									</div>
								)}
							</div>
						</div>
						<div className={`${styles.rightBlock} ${visibleMobileFilters ? styles.active : ""}`}>
							<div className={styles.mobileFilter}>
								<div
									className={styles.filterButton}
									onClick={() => {
										setVisibleMobileFilters(!visibleMobileFilters);
									}}
								>
									<div className={styles.icon} />
									<div className={styles.text}>
										{!visibleMobileFilters ? (language === "ru" ? "Фильтры" : "Filters") : language === "ru" ? "Фильтры" : "Filters"}
									</div>
								</div>
							</div>
							<ProjectsFilters
								language={language}
								projectTypes={projectTypes}
								ranges={ranges}
								selectedTypes={selectedTypes}
								setSelectedTypes={setSelectedTypes}
								selectedRanges={selectedRanges}
								setSelectedRanges={setSelectedRanges}
								resetFilters={() => {
									setSelectedTypes([]);
									setSelectedRanges([]);
								}}
							/>
							<div className={styles.mobileButtonsBlock}>
								<div
									className={`${styles.button} ${styles.resetButton}`}
									onClick={() => {
										setSelectedTypes([]);
										setSelectedRanges([]);
										// setVisibleMobileFilters(false);
									}}
								>
									<div className={styles.text}>Сбросить</div>
									<div className={styles.icon} />
								</div>
								<div
									className={`${styles.button} ${styles.acceptButton}`}
									onClick={() => {
										setVisibleMobileFilters(false);
									}}
								>
									<div className={styles.text}>Применить</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
