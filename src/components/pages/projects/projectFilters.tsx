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
}

export default function ProjectsFilters({ language, projectTypes, ranges, selectedTypes, setSelectedTypes, selectedRanges, setSelectedRanges, resetFilters }: Props) {
	const { data } = useProjectsPageStore();

	return (
		<div className={styles.projectsFilters}>
			{/* Тип помещения */}
			<div className={`${styles.filter} ${styles.typeFilter}`}>
				<div className={styles.filterNameBlock}>
					{data?.projects_page.filter_types.icon ? (
						<div className={styles.icon}>
							<img src={data.projects_page.filter_types.icon} alt="" />
						</div>
					) : (
						<div className={styles.icon}>
							<img src="/images/projects/typeFilterIcon.svg" alt="" />
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
							<img src="/images/projects/footageFilterIcon.svg" alt="" />
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
			<div className={styles.resetFilterButton} onClick={resetFilters}>
				{language === "ru" ? "Сбросить" : "Reset filters"}
			</div>
		</div>
	);
}
