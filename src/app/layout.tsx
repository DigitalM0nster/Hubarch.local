// src\app\layout.tsx

import type { Metadata } from "next";
import "@/CSS/fonts.css";
import "@/CSS/styles.scss";
import "@/CSS/application-styles.scss";
import "@/CSS/awards-styles.scss";
import HudMenu from "@/components/hudMenu/HudMenu";
import InteractiveLines from "@/components/interactiveLines/InteractiveLines";
import Preloader from "@/components/preloader/Preloader";
import Script from "next/script";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

type Props = {
	params: Promise<{
		language: string;
	}>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { language } = await params;
	return {
		title: "Hubarch — Главная",
		description: "Описание главной страницы",
		openGraph: {
			title: "Hubarch — Главная страница",
			description: "Описание главной страницы",
			url: `${siteUrl}/${language}`,
			images: [
				{
					url: `${siteUrl}/images/og-default.jpg`,
					width: 1200,
					height: 630,
				},
			],
			type: "website",
		},
	};
}

export function generateStaticParams() {
	return [{ language: "ru" }, { language: "en" }];
}

export default async function RootLayout(props: { children: React.ReactNode; params: { lang: string } }) {
	const params = await props.params;

	const { children } = props;

	const lang = params.lang === "en" ? "en" : "ru"; // Берём язык из URL

	return (
		<html lang={lang}>
			<body>
				<HudMenu />
				<InteractiveLines />
				<Preloader />
				{children}
				<Script src="/customJs/initial-preloader.js" strategy="afterInteractive" />
			</body>
		</html>
	);
}
