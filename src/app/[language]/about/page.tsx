export function generateStaticParams() {
	return [{ language: "ru" }, { language: "en" }]; // Доступные языки
}

export default function About({ params }: { params: { language: string } }) {
	const { language } = params;

	return (
		<main>
			<h1>{language === "ru" ? "Страница о нас" : "Page about us!"}</h1>
		</main>
	);
}
