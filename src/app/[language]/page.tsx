export function generateStaticParams() {
	return [{ language: "ru" }, { language: "en" }]; // Доступные языки
}

export default async function Home({ params }: { params: { language: string } }) {
	const { language } = await params;

	return (
		<main>
			<h1>{language === "ru" ? "Добро пожаловать в Hubarch!" : "Welcome to Hubarch!"}</h1>
		</main>
	);
}
