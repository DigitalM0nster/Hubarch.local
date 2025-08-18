import { useProjectsPageStore } from "@/store/projectsPageStore";
import styles from "./styles.module.scss";
import { useEffect } from "react";

interface Props {
	language: string;
	projectTypes: { id: number; name: string }[];
	ranges: { min: number; max: number; label: string }[];
	selectedTypes: number[];
	setSelectedTypes: (types: number[]) => void;
	selectedRanges: { min: number; max: number }[];
	setSelectedRanges: (ranges: { min: number; max: number }[]) => void;
	resetFilters: () => void;

	selectedCategory: string | null;
	setSelectedCategory: (category: string | null) => void;
	isResetButtonActive: boolean;
}

export default function ProjectsFilters({
	language,
	projectTypes,
	ranges,
	selectedTypes,
	setSelectedTypes,
	selectedRanges,
	setSelectedRanges,
	resetFilters,
	selectedCategory,
	setSelectedCategory,
	isResetButtonActive,
}: Props) {
	const { data } = useProjectsPageStore();

	return (
		<div className={styles.projectsFilters}>
			{/* Категория проекта */}
			<div className={`${styles.filter} ${styles.categoryFilter}`}>
				<div className={styles.filterNameBlock}>
					<div className={styles.icon}>
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
							<path d="M0 10.0959V16.5H16V0.5H9.09323L0 10.0959Z" fill="var(--mainTextColor)" />
						</svg>
					</div>
					<div className={styles.name}>{language === "ru" ? "Категория" : "Category"}</div>
				</div>
				<div className={styles.filterValues}>
					{[
						{ slug: "architecture", label: language === "ru" ? "Архитектура" : "Architecture" },
						{ slug: "interior", label: language === "ru" ? "Интерьеры" : "Interior" },
					].map((cat) => {
						const isActive = selectedCategory === cat.slug;
						const toggle = isActive ? null : cat.slug;

						return (
							<div key={cat.slug} className={`${styles.value} ${isActive ? styles.active : ""}`} onClick={() => setSelectedCategory(toggle)}>
								{cat.label}
							</div>
						);
					})}
				</div>
			</div>

			{/* Тип помещения */}
			<div className={`${styles.filter} ${styles.typeFilter}`}>
				<div className={styles.filterNameBlock}>
					{data?.projects_page.filter_types.icon ? (
						<div className={styles.icon}>
							<img src={data.projects_page.filter_types.icon} alt="" />
						</div>
					) : (
						<div className={styles.icon}>
							<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
								<path fillRule="evenodd" clipRule="evenodd" d="M16 0H0V16H16V0ZM13.1911 9.20098H7.00282V16H13.1911V9.20098Z" fill="var(--mainTextColor)" />
							</svg>
						</div>
					)}
					{data?.projects_page.filter_types.title ? (
						<div className={styles.name}>{data.projects_page.filter_types.title}</div>
					) : (
						<div className={styles.name}>{language === "ru" ? "Тип помещения" : "Space type"}</div>
					)}
				</div>
				<div className={styles.filterValues}>
					{projectTypes.map((projectType) => {
						const isActive = selectedTypes.includes(projectType.id);
						const newSelectedTypes = isActive ? selectedTypes.filter((id) => id !== projectType.id) : [...selectedTypes, projectType.id];

						return (
							<div key={projectType.id} className={`${styles.value} ${isActive ? styles.active : ""}`} onClick={() => setSelectedTypes(newSelectedTypes)}>
								{projectType.name}
							</div>
						);
					})}
				</div>
			</div>

			{/* Площадь */}
			<div className={`${styles.filter} ${styles.footageFilter}`}>
				<div className={styles.filterNameBlock}>
					{data?.projects_page.filter_footage.icon ? (
						<div className={styles.icon}>
							<img src={data.projects_page.filter_footage.icon} alt="" />
						</div>
					) : (
						<div className={styles.icon}>
							<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
								<path fillRule="evenodd" clipRule="evenodd" d="M14.7379 1.26209H1.26209V14.7379H14.7379V1.26209ZM16 0V16H0V0H16Z" fill="var(--mainTextColor)" />
								<path
									fillRule="evenodd"
									clipRule="evenodd"
									d="M10.4016 5.06262L12.8212 2.64297L13.397 3.21874L10.9773 5.63838L10.4016 5.06262ZM5.06276 5.63838L2.64311 3.21874L3.21887 2.64297L5.63852 5.06262L5.06276 5.63838ZM5.63852 10.9772L3.21887 13.3969L2.64311 12.8211L5.06276 10.4014L5.63852 10.9772ZM12.8212 13.3969L10.4016 10.9772L10.9773 10.4014L13.397 12.8211L12.8212 13.3969Z"
									fill="var(--mainTextColor)"
								/>
							</svg>
						</div>
					)}
					{data?.projects_page.filter_footage.title ? (
						<div className={styles.name}>{data.projects_page.filter_footage.title}</div>
					) : (
						<div className={styles.name}>{language === "ru" ? "Площадь, м²" : "Area, m²"}</div>
					)}
				</div>
				<div className={styles.filterValues}>
					{ranges.map((range, index) => {
						const rangeObj = { min: range.min, max: range.max };
						const isActive = selectedRanges.some((r) => r.min === rangeObj.min && r.max === rangeObj.max);

						const newSelectedRanges = isActive ? selectedRanges.filter((r) => !(r.min === rangeObj.min && r.max === rangeObj.max)) : [...selectedRanges, rangeObj];

						return (
							<div key={index} className={`${styles.value} ${isActive ? styles.active : ""}`} onClick={() => setSelectedRanges(newSelectedRanges)}>
								{range.label}
							</div>
						);
					})}
				</div>
			</div>

			{/* Сброс */}
			<div
				className={`${styles.resetFilterButton} ${isResetButtonActive ? "" : styles.disabled}`}
				onClick={() => {
					if (isResetButtonActive) {
						resetFilters();
					}
				}}
			>
				{language === "ru" ? "Сбросить" : "Reset filters"}
			</div>
		</div>
	);
}
