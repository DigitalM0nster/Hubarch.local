// src\app\[language]\page.tsx

import MainPageClient from "@/components/pages/mainPage/mainPageClient";

export function generateStaticParams() {
	return [{ language: "ru" }, { language: "en" }]; // Доступные языки
}

export default async function Home({ params }: { params: Promise<{ language: string }> }) {
	const resolvedParams = await params;
	const language = resolvedParams.language;

	return <MainPageClient key={language} language={language} />;
}
