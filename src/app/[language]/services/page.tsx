import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://hubarch.local";

export function generateStaticParams() {
	return [{ language: "ru" }, { language: "en" }]; // Доступные языки
}

export const metadata: Metadata = {
	title: "Hubarch - услуги",
	description: "Описание страницы услуги",
	openGraph: {
		title: "Hubarch - услуги",
		description: "Описание страницы услуги",
		url: `${siteUrl}/services`, // Динамически подставляем домен
		images: [
			{
				url: `${siteUrl}/images/about-us.jpg`, // Динамический URL для картинки
				width: 1200,
				height: 630,
			},
		],
		type: "article",
	},
};

export default function Services() {
	return (
		<>
			<main>
				<h1>Наши услуги</h1>
				<p>Описание всех услуг, которые мы предоставляем.</p>
			</main>
		</>
	);
}
