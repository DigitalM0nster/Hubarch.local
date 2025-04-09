import styles from "./styles.module.scss";
import { useMainPageStore } from "@/store/mainPageStore";
import { usePreloaderStore } from "@/store/preloaderStore";
import { useEffect, useRef } from "react";
import ProjectItem from "./projectItem";
import LinkWithPreloader from "@/components/preloader/LinkWithPreloader";
import { useWindowStore } from "@/store/windowStore";

export default function Screen3({ language }: { language: string }) {
	const { markReady } = usePreloaderStore();
	const { isMobile } = useWindowStore();

	const data = useMainPageStore((state) => state.data?.main_page_screen3);
	const containerRef = useRef<HTMLDivElement>(null);

	// ОТМЕЧАЕМСЯ ДЛЯ ПРЕЛОАДЕРА

	/* eslint-disable react-hooks/exhaustive-deps */
	useEffect(() => {
		if (data) {
			alert("gg3");
			markReady();
		}
		alert("gg3_1");
	}, [data]);
	/* eslint-enable react-hooks/exhaustive-deps */

	type ProjectData = {
		project?:
			| {
					id: number;
					title: {
						rendered: string;
					};
					acf: {
						project_preview: string;
					};
					slug: string;
			  }
			| undefined;
	} | null;

	const projectBlocks = data?.projects || [];
	const filledProjects: ProjectData[] = [...projectBlocks];
	while (filledProjects.length < 4) filledProjects.push(null);

	return (
		<>
			<div
				className={`screen ${styles.screen3}`}
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
					{data?.title_background && <div className={`titleBackground ${styles.titleBackground}`}>{data.title_background}</div>}
					<div ref={containerRef} className={styles.projectsContainer}>
						{filledProjects.map((item, index) => (
							<ProjectItem key={index} project={item?.project || undefined} index={index} language={language} />
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
