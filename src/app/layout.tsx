// src\app\layout.tsx

import type { Metadata } from "next";
import "@/CSS/fonts.css";
import "@/CSS/styles.scss";
import HudMenu from "@/components/hudMenu/HudMenu";
import InteractiveLines from "@/components/interactiveLines/InteractiveLines";
import Preloader from "@/components/preloader/Preloader";
import Script from "next/script";

export const generateMetadata = async (props: { params: Promise<{ lang: string }> }): Promise<Metadata> => {
	const params = await props.params;
	const lang = params.lang === "en" ? "en" : "ru"; // Определяем язык из URL

	return {
		title: lang === "ru" ? "Hubarch – Инновационные проекты" : "Hubarch – Innovative Projects",
		description: lang === "ru" ? "Создаём лучшие цифровые решения для бизнеса." : "We create the best digital solutions for business.",
		openGraph: {
			title: lang === "ru" ? "Hubarch – Инновационные проекты" : "Hubarch – Innovative Projects",
			description: lang === "ru" ? "Создаём лучшие цифровые решения для бизнеса." : "We create the best digital solutions for business.",
			url: "https://hubarch.local",
			siteName: "Hubarch",
			images: [
				{
					url: "/images/hubarch_logo.svg",
					width: 1200,
					height: 630,
				},
			],
			type: "website",
		},
	};
};

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
