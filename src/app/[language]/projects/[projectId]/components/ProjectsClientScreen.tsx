"use client";

import Screen3 from "@/components/pages/mainPage/screen3";
import { useAllProjectsStore } from "@/store/allProjectsStore";
import { useEffect } from "react";

export default function ProjectsClientScreen({ language, currentProjectId }: { language: string; currentProjectId: string }) {
	const { fetchAllProjects, projectsList } = useAllProjectsStore();
	useEffect(() => {
		fetchAllProjects(language);
	}, []);

	return <Screen3 language={language} projects={projectsList} currentProjectId={currentProjectId} />;
}
