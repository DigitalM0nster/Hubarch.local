// src\app\[language]\projects\[projectId]\ProjectId.tsx

import ClientComponent from "./components/ClientComponent";
import styles from "./components/styles.module.scss";

import ImageScreen from "./components/ImageScreen";
import ContentCenterScreen from "./components/ContentCenterScreen";
import ContentLeftScreen from "./components/ContentLeftScreen";
import ContentRightScreen from "./components/ContentRightScreen";
import GalleryScreen from "./components/GalleryScreen";
import ContentListsScreen from "./components/ContentListsScreen";
import Screen1 from "./components/Screen1";
import Screen2 from "./components/Screen2";
import ProjectsScreen from "./components/ProjectsScreen";
import Screen7 from "@/components/pages/mainPage/screen7";
import LinkWithPreloader from "@/components/preloader/LinkWithPreloader";

interface ProjectIdPageProps {
	language: string;
	projectId: string;
	projectData: any;
}

export default function ProjectIdPage({ language, projectId, projectData }: ProjectIdPageProps) {
	const ConstructorMap: Record<string, React.FC<{ blockData: any; language: string; projectId: string; projectData: any }>> = {
		image_screen: ImageScreen,
		content_center_screen: ContentCenterScreen,
		content_left_screen: ContentLeftScreen,
		content_right_screen: ContentRightScreen,
		content_lists_screen: ContentListsScreen,
		gallery_screen: GalleryScreen,
	};

	if (!projectData) {
		return (
			<>
				<ClientComponent projectData={""} />
				<div className={`screenScroll ${styles.screenScroll}`} id="projectContainer">
					<div
						className={`screen active ${styles.screen} ${styles.notFoundScreen}`}
						data-screen-lightness="light"
						data-lines-index={-1}
						data-mini-line-rotation={-45}
						data-position-x={50}
						data-position-y={50}
						data-vertical-y={50}
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
							<div className={styles.textBlock}>
								Извините, проект не найден. <br />
								Перейти на главную страницу?
							</div>
							<LinkWithPreloader href={`/${language}`} className={styles.button}>
								<div className={styles.icon} />
								<div className={styles.text}>Перейти</div>
							</LinkWithPreloader>
						</div>
					</div>
				</div>
			</>
		);
	}

	return (
		<>
			<ClientComponent projectData={projectData} />
			<div className={`screenScroll ${styles.screenScroll} simpleScroll`} id="projectContainer">
				<Screen1 projectData={projectData} />
				<Screen2 language={language} projectData={projectData} />
				{projectData?.acf?.project_blocks != false &&
					projectData?.acf?.project_blocks?.map((projectBlock: any, index: number) => {
						// console.log("ProjectIDPage -> projectBlock", projectBlock);
						const BlockComponent = ConstructorMap[projectBlock.acf_fc_layout];

						return <BlockComponent key={index} blockData={projectBlock} language={language} projectId={projectId} projectData={projectData} />;
					})}
				<ProjectsScreen language={language} currentProjectId={projectId} />
				<Screen7 language={language} />
			</div>
		</>
	);
}
