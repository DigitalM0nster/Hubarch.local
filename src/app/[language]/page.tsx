// src/app/[language]/page.tsx
import type { Metadata } from "next";

type Props = {
	params: {
		language: string;
	};
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	return {
		title: `Hubarch — Главная (${params.language})`,
		description: "Описание главной страницы",
		openGraph: {
			title: `Hubarch — Главная (${params.language})`,
			description: "Описание главной страницы",
			url: `https://hubarch.local/${params.language}`,
			images: [
				{
					url: `https://hubarch.local/images/og-default.jpg`,
					width: 1200,
					height: 630,
				},
			],
		},
	};
}

export function generateStaticParams() {
	return [{ language: "ru" }, { language: "en" }];
}

// ✅ главное отличие — const вместо function
const Home = ({ params }: Props) => {
	return (
		<main>
			<h1>Главная страница: {params.language}</h1>
		</main>
	);
};

export default Home;
