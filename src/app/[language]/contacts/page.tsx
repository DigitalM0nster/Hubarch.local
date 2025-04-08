import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export const metadata: Metadata = {
	title: "Hubarch - контакты",
	description: "Описание страницы контакты",
	openGraph: {
		title: "Hubarch - контакты",
		description: "Описание страницы контакты",
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

export function generateStaticParams() {
	return [{ language: "ru" }, { language: "en" }]; // Доступные языки
}

export default function Contacts() {
	return (
		<>
			<main>
				<h1>Контакты</h1>
				<p>Контактная информация</p>
			</main>
		</>
	);
}
