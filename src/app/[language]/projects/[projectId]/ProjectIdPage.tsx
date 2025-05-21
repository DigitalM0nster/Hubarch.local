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
import Screen3 from "@/components/pages/mainPage/screen3";
import ProjectsClientScreen from "./components/ProjectsClientScreen";
import Screen7 from "@/components/pages/mainPage/screen7";

export default function ProjectIdPage({ language, projectId, projectData }: { language: string; projectId: string; projectData: any }) {
	// Получаем данные проекта из стора или из initialData
	// console.log(projectData);

	const ConstructorMap: Record<string, React.FC<{ blockData: any; language: string; projectId: string; projectData: any }>> = {
		image_screen: ImageScreen,
		content_center_screen: ContentCenterScreen,
		content_left_screen: ContentLeftScreen,
		content_right_screen: ContentRightScreen,
		content_lists_screen: ContentListsScreen,
		gallery_screen: GalleryScreen,
	};

	return (
		<>
			<ClientComponent />
			<div className={`screenScroll ${styles.screenScroll} simpleScroll`}>
				<Screen1 projectData={projectData} />
				<Screen2 language={language} projectData={projectData} />
				{projectData?.acf?.project_blocks != false &&
					projectData?.acf?.project_blocks?.map((projectBlock: any, index: number) => {
						const BlockComponent = ConstructorMap[projectBlock.acf_fc_layout];

						return <BlockComponent blockData={projectBlock} language={language} projectId={projectId} projectData={projectData} />;
					})}
				<ProjectsClientScreen language={language} currentProjectId={projectId} />
				<Screen7 language={language} />
			</div>
		</>
	);
}
