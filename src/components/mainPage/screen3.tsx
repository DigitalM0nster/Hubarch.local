import styles from "./styles.module.scss";
import { useMainPageStore } from "@/store/mainPageStore";
import { preloaderStore } from "@/store/preloaderStore";
import { useEffect, useRef } from "react";
import ProjectItem from "./projectItem";
import LinkWithPreloader from "@/components/linkWithPreloader/LinkWithPreloader";

export default function Screen3({ language }: { language: string }) {
	const data = useMainPageStore((state) => state.data?.main_page_screen3);
	const containerRef = useRef<HTMLDivElement>(null);

	// ОТМЕЧАЕМСЯ ДЛЯ ПРЕЛОАДЕРА
	useEffect(() => {
		preloaderStore.markReady();
	}, []);

	useEffect(() => {
		// console.log(data);
	}, [data]);

	type ProjectData = { project: any } | null;

	const projectBlocks = data?.projects || [];
	const filledProjects: ProjectData[] = [...projectBlocks];
	while (filledProjects.length < 4) filledProjects.push(null);

	return (
		<>
			<div
				className={`screen ${styles.screen3}`}
				data-screen-lightness="light"
				data-lines-index={1}
				data-mini-line-rotation={-45}
				data-position-x={50}
				data-position-y={50}
				data-position-z={50}
			>
				<div className={`screenContent ${styles.screenContent}`}>
					{data?.titleBackground && <div className={`titleBackground ${styles.titleBackground}`}>{data.titleBackground}</div>}
					<div ref={containerRef} className={styles.projectsContainer}>
						{filledProjects.map((item, index) => (
							<ProjectItem key={index} project={item?.project || null} index={index} language={language} />
						))}
					</div>
					<LinkWithPreloader href={`/${language}/projects`} className={styles.allProjectsButton}>
						<div className={styles.icon} />
						<div className={styles.text}>{language === "ru" ? "Все проекты" : "All projects"}</div>
					</LinkWithPreloader>
				</div>
			</div>
		</>
	);
}
