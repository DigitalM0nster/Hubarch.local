"use client";

import { useState, useEffect } from "react";
import styles from "./styles.module.scss";

interface News {
	id: number;
	slug: string;
	title: { rendered: string };
	acf: { image_url?: string };
}

export function generateStaticParams() {
	return [{ language: "ru" }, { language: "en" }]; // Доступные языки
}

export default function Media() {
	const [media, setMedia] = useState<News[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const loadMedia = async () => {
			try {
				const res = await fetch(`${process.env.NEXT_PUBLIC_WP_API}/media?per_page=20`);
				if (!res.ok) throw new Error("Ошибка загрузки проектов");

				const data: News[] = await res.json();
				console.log(data);
				setMedia(data);
			} catch (error) {
				console.error("❌ Ошибка при загрузке:", error);
			} finally {
				setLoading(false);
			}
		};

		loadMedia();
	}, []);

	return (
		<>
			<div className={`${styles.screenContent} screenContent`}>
				<h1>Проекты</h1>

				{loading && <p>Загрузка...</p>}
				{!loading && media.length === 0 && <p>Статьей пока нет.</p>}

				<div className={styles.projectList}>
					{media.map((project) => (
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
