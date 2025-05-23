// src\app\[language]\projects\[projectId]\ProjectId.tsx

"use client";

import { useEffect, useState } from "react";
import ClientComponent from "./components/ClientComponent";
import styles from "./components/styles.module.scss";
import { getProjectData } from "./getProjectData";

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

interface ProjectIdPageProps {
	language: string;
	projectId: string;
	initialData: any;
}

export default function ProjectIdPage({ language, projectId, initialData }: ProjectIdPageProps) {
	const [projectData, setProjectData] = useState(initialData);

	// Функция для обновления данных
	const refreshData = async () => {
		try {
			const newData = await getProjectData(language, projectId);
			setProjectData(newData);
			console.log("ProjectIdPage: Data refreshed", newData);
		} catch (error) {
			console.error("Error refreshing data:", error);
		}
	};

	// Обновляем данные при изменении параметров
	useEffect(() => {
		refreshData();
	}, [language, projectId]);

	const ConstructorMap: Record<string, React.FC<{ blockData: any; language: string; projectId: string; projectData: any }>> = {
		image_screen: ImageScreen,
		content_center_screen: ContentCenterScreen,
		content_left_screen: ContentLeftScreen,
		content_right_screen: ContentRightScreen,
		content_lists_screen: ContentListsScreen,
		gallery_screen: GalleryScreen,
	};

	if (!projectData) {
		return <div>Loading...</div>;
	}

	return (
		<>
			<ClientComponent />
			<div className={`screenScroll ${styles.screenScroll} simpleScroll`}>
				<Screen1 projectData={projectData} />
				<Screen2 language={language} projectData={projectData} />
				{projectData?.acf?.project_blocks != false &&
					projectData?.acf?.project_blocks?.map((projectBlock: any, index: number) => {
						console.log("ProjectIDPage -> projectBlock", projectBlock);
						const BlockComponent = ConstructorMap[projectBlock.acf_fc_layout];

						return <BlockComponent key={index} blockData={projectBlock} language={language} projectId={projectId} projectData={projectData} />;
					})}
				<ProjectsClientScreen language={language} currentProjectId={projectId} />
				<Screen7 language={language} />
			</div>
		</>
	);
}
