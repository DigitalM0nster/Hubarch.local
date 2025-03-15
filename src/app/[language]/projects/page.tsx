"use client";

import { useState, useEffect } from "react";
import styles from "./styles.module.scss";

interface Project {
	id: number;
	slug: string;
	title: { rendered: string };
	acf: { image_url?: string };
}

export function generateStaticParams() {
	return [{ language: "ru" }, { language: "en" }]; // Доступные языки
}

export default function ProjectsPage() {
	const [projects, setProjects] = useState<Project[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const loadProjects = async () => {
			try {
				const res = await fetch(`${process.env.NEXT_PUBLIC_WP_API}/projects?per_page=20`);
				if (!res.ok) throw new Error("Ошибка загрузки проектов");

				const data: Project[] = await res.json();
				console.log(data);
				setProjects(data);
			} catch (error) {
				console.error("❌ Ошибка при загрузке:", error);
			} finally {
				setLoading(false);
			}
		};

		loadProjects();
	}, []);

	return (
		<>
			<div className={`${styles.screenContent} screenContent`}>
				<h1>Проекты</h1>

				{loading && <p>Загрузка...</p>}
				{!loading && projects.length === 0 && <p>Проектов пока нет.</p>}

				<div className={styles.projectList}>
					{projects.map((project) => (
						<div key={project.id} className={styles.projectCard}>
							<img src={project.acf.image_url || "/placeholder.jpg"} alt={project.title.rendered} />
							<h2>{project.title.rendered}</h2>
						</div>
					))}
				</div>
			</div>
		</>
	);
}
