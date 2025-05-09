import styles from "./styles.module.scss";

export function generateStaticParams() {
	return [{ language: "ru" }, { language: "en" }]; // Доступные языки
}

export default async function Media({ params }: { params: Promise<{ language: string }> }) {
	const resolvedParams = await params;
	const language = resolvedParams.language;

	return (
		<div className={`${styles.screenContent} screenContent`}>
			<h1>{language === "ru" ? "Медиа" : "Media"}</h1>
		</div>
	);
}
