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
import ProjectsFilters from "./ProjectsFilters";
import { useWindowStore } from "@/store/windowStore";
import { usePageReady } from "@/hooks/usePageReady";
import { useHudMenuStore } from "@/store/hudMenuStore";

export default function ProjectsPageClient({ language }: { language: string }) {
	useScreenInit();
	useDetectMobile();
	const { fetchAllProjects, projectsList, allProjectsFetchFinished } = useAllProjectsStore();
	const { fetchProjectTypes, projectTypes, projectTypesFetchFinished } = useProjectTypesStore();
	const { fetchData, projectsPageFetchFinished, data } = useProjectsPageStore();
	const { fetchRanges, ranges, areaRangesFetchFinished } = useAreaRangeStore();
	const { setPageState, setIsProjectLoading, setProjectImage, setImageRect, addCachedImage } = usePreloaderStore();
	const { scrollAllowed, setScrollAllowed } = useScrollStore();
	const { isMobile, windowWidth, readyCheck, setReadyCheck } = useWindowStore();
	const { visibleMobileFilters, setVisibleMobileFilters } = useHudMenuStore();

	const containerRef = useRef<HTMLDivElement>(null);

	// Используем один реф для хранения всех изображений
	const projectImagesRef = useRef<Map<number, HTMLDivElement>>(new Map());

	// DRAGGING
	const listRef = useRef<HTMLDivElement>(null);
	const startX = useRef(0);
	const isDragging = useRef(false);
	const [dragOffset, setDragOffset] = useState(0);

	const centerRef = useRef<HTMLDivElement>(null);
	const startY = useRef(0);
	const isVerticalDragging = useRef(false);
	const [dragOffsetY, setDragOffsetY] = useState(0);

	// Используем хук для проверки готовности страницы
	// Передаем массив зависимостей, которые должны быть загружены
	const pageReady = usePageReady([projectsList, data, projectTypes, ranges], containerRef);

	// Состояния фильтров
	const [selectedTypes, setSelectedTypes] = useState<number[]>([]);
	const [selectedRanges, setSelectedRanges] = useState<{ min: number; max: number }[]>([]);
	const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

	// Активный проект
	const [activeProjectIndex, setActiveProjectIndex] = useState(0);

	// Добавляем состояние активности кнопки 'Сбросить'
	const [isResetButtonActive, setIsResetButtonActive] = useState(false);

	// Функция фильтрации
	const filteredProjects = projectsList.filter((project) => {
		// Проверяем, что project_type существует и является массивом
		const projectType = project.acf.project_type;
		let matchesType = selectedTypes.length === 0;

		if (projectType) {
			// Проверяем, является ли project_type массивом
			if (Array.isArray(projectType)) {
				matchesType =
					matchesType ||
					projectType.some((type) => {
						if (typeof type === "object" && type !== null && "term_id" in type) {
							// Если это объект с term_id
							return selectedTypes.includes((type as { term_id: number }).term_id);
						} else {
							// Если это строка или число
							const typeId = typeof type === "string" ? parseInt(type, 10) : Number(type);
							return !isNaN(typeId) && selectedTypes.includes(typeId);
						}
					});
			} else if (typeof projectType === "object" && projectType !== null && "term_id" in projectType) {
				// Если это один объект с term_id
				matchesType = matchesType || selectedTypes.includes((projectType as { term_id: number }).term_id);
			}
		}

		const footage = parseInt(project.acf.project_footage || "0", 10);
		const matchesRange = selectedRanges.length === 0 || selectedRanges.some((range) => footage >= range.min && footage <= range.max);

		const matchesCategory = !selectedCategory || project.acf.project_category?.slug === selectedCategory;

		return matchesType && matchesRange && matchesCategory;
	});

	useEffect(() => {
		fetchData(language);
		fetchAllProjects(language);
		fetchProjectTypes(language);
		fetchRanges();

		return () => {
			setVisibleMobileFilters(false);
		};
	}, []);

	// Устанавливаем pageState = "ready" только когда страница полностью готова
	useEffect(() => {
		if (pageReady) {
			setPageState("ready");
			setScrollAllowed(true);
		} else {
			setPageState("loading");
			setScrollAllowed(false);
		}
	}, [pageReady]);

	useEffect(() => {
		projectsList.forEach((project, index) => {
			if (project?.acf?.project_preview !== false) {
				addCachedImage({ src: project?.acf?.project_preview ?? "" });
			}
		});
	}, [projectsList]);

	useEffect(() => {
		if (activeProjectIndex > filteredProjects.length - 1) {
			setActiveProjectIndex(Math.max(filteredProjects.length - 1, 0));
		}
	}, [filteredProjects.length]);

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

	// ГОРИЗОНАТЛЬНЫЙ СКРОЛЛ ВНИЗУ
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

	// ВЕРТИКАЛЬНЫЙ СКРОЛЛ В ЦЕНТРЕ
	useEffect(() => {
		if (!isMobile || !centerRef.current) return;

		const container = centerRef.current;

		const handleTouchStart = (e: TouchEvent) => {
			isVerticalDragging.current = true;
			startY.current = e.touches[0].clientY;
		};

		const handleTouchMove = (e: TouchEvent) => {
			if (!isVerticalDragging.current) return;
			const delta = e.touches[0].clientY - startY.current;
			setDragOffsetY(delta);
		};

		const handleTouchEnd = () => {
			isVerticalDragging.current = false;

			if (!container) return;

			const cards = container.querySelectorAll(`.${styles.projectItem}`);
			const containerRect = container.getBoundingClientRect();
			const centerY = containerRect.top + containerRect.height / 2;

			let closestIndex = 0;
			let closestDistance = Infinity;

			cards.forEach((card, index) => {
				const rect = card.getBoundingClientRect();
				const cardCenter = rect.top + rect.height / 2;
				const distance = Math.abs(centerY - cardCenter);

				if (distance < closestDistance) {
					closestDistance = distance;
					closestIndex = index;
				}
			});

			setActiveProjectIndex(closestIndex);
			setDragOffsetY(0);
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

	// Функция для получения информации о позиции и размере активной картинки
	const getActiveImageRect = () => {
		if (filteredProjects.length === 0 || !projectImagesRef.current.has(activeProjectIndex)) {
			return null;
		}

		const imageElement = projectImagesRef.current.get(activeProjectIndex);
		return imageElement?.getBoundingClientRect();
	};

	// Обновляем состояние активности кнопки 'Сбросить' при изменении фильтров
	useEffect(() => {
		const hasActiveFilters = selectedTypes.length > 0 || selectedRanges.length > 0 || selectedCategory !== null;
		setIsResetButtonActive(hasActiveFilters);
	}, [selectedTypes, selectedRanges, selectedCategory]);

	useEffect(() => {
		if (data?.page_main_settings?.background_color) {
			// Устанавливаем CSS переменную --backgroundColor в :root
			document.documentElement.style.setProperty("--backgroundColor", data.page_main_settings.background_color);
			document.documentElement.style.setProperty("--backgroundColorTransparent", data.page_main_settings.background_color + "40");
		} else {
			// Если данные еще не загружены, устанавливаем fallback значение
			document.documentElement.style.setProperty("--backgroundColor", "#fbf9f4");
			document.documentElement.style.setProperty("--backgroundColorTransparent", "#fbf9f440");
		}

		if (data?.page_main_settings?.text_is_light) {
			// Устанавливаем CSS переменную --backgroundColor в :root
			document.documentElement.style.setProperty("--mainTextColor", "#fbf9f4");
			document.documentElement.style.setProperty("--mainTextColorTransparent", "#fbf9f440");
		} else {
			// Если данные еще не загружены, устанавливаем fallback значение
			document.documentElement.style.setProperty("--mainTextColor", "#101118");
			document.documentElement.style.setProperty("--mainTextColorTransparent", "#10111840");
		}

		setReadyCheck(!readyCheck);

		// Возвращаем исходное значение #fbf9f4
		return () => {
			document.documentElement.style.setProperty("--backgroundColor", "#fbf9f4");
			document.documentElement.style.setProperty("--backgroundColorTransparent", "#fbf9f440");
			document.documentElement.style.setProperty("--mainTextColor", "#101118");
			document.documentElement.style.setProperty("--mainTextColorTransparent", "#10111840");
		};
	}, [data?.page_main_settings?.background_color, data?.page_main_settings?.text_is_light]);

	return (
		<>
			<div ref={containerRef} className={`screenScroll ${styles.screenScroll} ${scrollAllowed === true ? "" : "noScroll"} projectsPage`}>
				<div
					className={`screen active ${styles.screen}`}
					data-screen-lightness={data?.page_main_settings?.text_is_light ? "dark" : "light"}
					data-lines-index={1}
					data-mini-line-rotation={-45}
					data-position-x={50}
					data-position-y={50}
					data-horizontal-x={50}
					data-horizontal-width={80}
					data-vertical-height={isMobile ? 50 : 100}
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
												<img
													src={project.acf.project_preview != false ? project.acf.project_preview : "/images/projects/placeholder.png"}
													alt={project.title.rendered}
												/>
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
						<div ref={centerRef} className={`${styles.centerBlock}  ${filteredProjects.length < 1 ? styles.noProjects : ""}`}>
							<div
								className={styles.projectsItems}
								style={{
									transform: isMobile
										? `translateY(calc(${dragOffsetY}px + (var(--projectItemHeight) + var(--projectItemsGap)) * -${activeProjectIndex}))`
										: `translateY(calc((var(--projectItemHeight) + var(--projectItemsGap)) * -${activeProjectIndex}))`,
									transition: isVerticalDragging.current ? "none" : "transform 0.3s ease",
									touchAction: "pan-x", // чтобы вертикальный свайп не мешался с горизонтальным
								}}
							>
								{projectsList.length > 0 ? (
									filteredProjects.length > 0 ? (
										filteredProjects.map((project, index) => {
											return (
												<LinkWithPreloader
													href={`/${language}/projects/${project.slug}`}
													key={`project${index}`}
													className={`${styles.projectItem} ${activeProjectIndex === index ? styles.active : ""} ${
														activeProjectIndex > index ? styles.prev : ""
													}`}
													customClick={() => {
														// Получаем размеры и позицию активного изображения
														const localImageRect = getActiveImageRect();

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
																innerImageWidth: "105%",
																innerImageHeight: "105%",
																progressLineTransition: "all 0.25s 0.3s",
																progressTransition: "all 0.25s 0.45s",
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
																	progressLineTransition: "all 0.25s 0.3s",
																	progressTransition: "all 0.25s 0.45s",
																});
															}, 0);
														}

														setIsProjectLoading(true);
														setProjectImage(project.acf.project_preview);
													}}
												>
													<div
														className={styles.image}
														ref={(el) => {
															if (el) {
																projectImagesRef.current.set(index, el);
															}
														}}
													>
														<img
															src={project.acf.project_preview != false ? project.acf.project_preview : "/images/projects/placeholder_big.png"}
															alt={project.title.rendered}
														/>
													</div>
													<div className={styles.aboutProject}>
														<div className={styles.buttonBlock}>
															<div className={styles.button}>
																<div className={styles.text}>{language === "ru" ? "Подробнее" : "More"}</div>
																<div className={styles.icon}>
																	<svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none">
																		<path
																			fillRule="evenodd"
																			clipRule="evenodd"
																			d="M4.24669 16.7533C7.7003 20.2069 13.2997 20.2069 16.7533 16.7533C20.2069 13.2997 20.2069 7.7003 16.7533 4.24669C13.2997 0.793087 7.7003 0.793087 4.24669 4.24669C0.793087 7.7003 0.793087 13.2997 4.24669 16.7533ZM3.07538 17.9246C7.17588 22.0251 13.8241 22.0251 17.9246 17.9246C22.0251 13.8241 22.0251 7.17588 17.9246 3.07538C13.8241 -1.02513 7.17588 -1.02513 3.07538 3.07538C-1.02513 7.17588 -1.02513 13.8241 3.07538 17.9246Z"
																			fill="var(--mainTextColor)"
																		/>
																		<path
																			d="M10.0097 4.9841L15.6774 10.6517L14.5061 11.8231L8.8384 6.15541L10.0097 4.9841Z"
																			fill="var(--mainTextColor)"
																		/>
																		<path
																			d="M15.6772 10.6516L10.0096 16.3193L8.83828 15.148L14.5059 9.48031L15.6772 10.6516Z"
																			fill="var(--mainTextColor)"
																		/>
																		<path d="M14.4709 11.3277H0.924743V9.6712H14.4709V11.3277Z" fill="var(--mainTextColor)" />
																	</svg>
																</div>
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
									<div className={styles.icon}>
										<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
											<path d="M11.5 4H13.5" stroke="var(--mainTextColor)" strokeLinecap="square" strokeLinejoin="round" />
											<path d="M11.5 12H13.5" stroke="var(--mainTextColor)" strokeLinecap="square" strokeLinejoin="round" />
											<path d="M2.5 4H9.5" stroke="var(--mainTextColor)" strokeLinecap="square" strokeLinejoin="round" />
											<path d="M2.5 12H9.5" stroke="var(--mainTextColor)" strokeLinecap="square" strokeLinejoin="round" />
											<path d="M7.5 8H13.5" stroke="var(--mainTextColor)" strokeLinecap="square" strokeLinejoin="round" />
											<path d="M2.5 8H5.5" stroke="var(--mainTextColor)" strokeLinecap="square" strokeLinejoin="round" />
											<path d="M9.5 3V5" stroke="var(--mainTextColor)" strokeLinecap="square" strokeLinejoin="round" />
											<path d="M9.5 11V13" stroke="var(--mainTextColor)" strokeLinecap="square" strokeLinejoin="round" />
											<path d="M5.5 7V9" stroke="var(--mainTextColor)" strokeLinecap="square" strokeLinejoin="round" />
										</svg>
									</div>
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
								selectedCategory={selectedCategory}
								setSelectedCategory={setSelectedCategory}
								resetFilters={() => {
									setSelectedTypes([]);
									setSelectedRanges([]);
									setSelectedCategory(null);
								}}
								isResetButtonActive={isResetButtonActive}
							/>

							<div className={styles.mobileButtonsBlock}>
								<div
									className={`${styles.button} ${styles.resetButton} ${isResetButtonActive ? styles.active : styles.inactive}`}
									onClick={() => {
										if (isResetButtonActive) {
											setSelectedTypes([]);
											setSelectedRanges([]);
											setSelectedCategory(null);
										}
									}}
								>
									<div className={styles.text}>{language === "ru" ? "Сбросить" : "Reset"}</div>
									<div className={styles.icon}>
										<svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
											<path d="M12.0019 1H1V12H1.00194H12.0019V1Z" stroke="var(--mainTextColor)" strokeLinecap="square" />
											<path d="M8.5 4.5L4.5 8.5" stroke="var(--mainTextColor)" strokeLinecap="square" />
											<path d="M4.5 4.5L8.5 8.5" stroke="var(--mainTextColor)" strokeLinecap="square" />
										</svg>
									</div>
								</div>
								<div
									className={`${styles.button} ${styles.acceptButton}`}
									onClick={() => {
										setVisibleMobileFilters(false);
									}}
								>
									<div className={styles.text}>{language === "ru" ? "Применить" : "Apply"}</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
