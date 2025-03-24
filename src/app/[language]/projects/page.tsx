// src\app\[language]\projects\page.tsx

import styles from "./styles.module.scss";

export function generateStaticParams() {
	return [{ language: "ru" }, { language: "en" }]; // Доступные языки
}

export default async function Projects(props: unknown) {
	const { language } = (props as { params: { language: string } }).params;

	return (
		<div className={`${styles.screenContent} screenContent`}>
			<h1>{language === "ru" ? "Проекты" : "Projects"}</h1>
		</div>
	);
}
