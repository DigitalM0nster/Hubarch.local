import styles from "./styles.module.scss";
import { useMainPageStore } from "@/store/mainPageStore";
import { usePreloaderStore } from "@/store/preloaderStore";
import { useEffect, useRef } from "react";
import ProjectItem from "./projectItem";
import LinkWithPreloader from "@/components/preloader/LinkWithPreloader";
import { useWindowStore } from "@/store/windowStore";
import type { Project } from "@/store/allProjectsStore";

// Типы перед компонентом
type Props = {
	language: string;
	projects?: any[]; // проекты из allProjectsStore
	currentProjectId?: string; // чтобы исключить текущий проект
};

export default function Screen3({ language, projects, currentProjectId }: Props) {
	const { isMobile } = useWindowStore();

	const storeData = useMainPageStore((state) => state.data?.main_page_screen3);
	const projectsFromStore = storeData?.projects || [];
	const containerRef = useRef<HTMLDivElement>(null);

	const projectsSource = projects ?? projectsFromStore;

	// Получаем плоский список проектов
	const flatProjects: Project[] = projectsSource.map((p) => (projects ? p : p?.project)).filter(Boolean) as Project[];

	// Удаляем дубликаты по id
	const uniqueProjects = flatProjects.filter((project, index, self) => project && self.findIndex((p) => p.id === project.id) === index);

	// Исключаем текущий проект
	const filtered = uniqueProjects.filter((project) => project.id !== Number(currentProjectId));

	const nearest: (Project | null)[] = filtered.slice(0, 4);
	while (nearest.length < 4) nearest.push(null);

	return (
		<div
			className={`screen ${styles.screen3} projectsScreen`}
			data-screen-lightness="light"
			data-lines-index={isMobile ? 1 : 1}
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
				{!projects ? (
					storeData?.title_background && <div className={`titleBackground ${styles.titleBackground}`}>{storeData.title_background}</div>
				) : (
					<div className={`titleBackground ${styles.titleBackground}`}>Ещё проекты</div>
				)}
				<div ref={containerRef} className={`${styles.projectsContainer} projectsContainer`}>
					{nearest.map((item, index) => (
						<ProjectItem key={index} project={item || undefined} index={index} language={language} />
					))}
				</div>
				{!projects && (
					<LinkWithPreloader href={`/${language}/projects`} className={styles.allProjectsButton}>
						<div className={styles.icon} />
						<div className={styles.text}>{language === "ru" ? "Все проекты" : "All projects"}</div>
					</LinkWithPreloader>
				)}
			</div>
		</div>
	);
}
