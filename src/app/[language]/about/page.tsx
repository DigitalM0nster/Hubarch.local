// src\app\[language]\about\page.tsx

export function generateStaticParams() {
	return [{ language: "ru" }, { language: "en" }]; // Доступные языки
}

export default async function About({ params }: { params: Promise<{ language: string }> }) {
	const resolvedParams = await params;
	const language = resolvedParams.language;

	return <h1>{language === "ru" ? "Страница о нас" : "Page about us!"}</h1>;
}
