// src\app\layout.tsx

import type { Metadata } from "next";
import "@/CSS/fonts.css";
import "@/CSS/styles.scss";
import HudMenu from "@/components/hudMenu/HudMenu";
import InteractiveLines from "@/components/interactiveLines/InteractiveLines";
import Preloader from "@/components/preloader/Preloader";

export const generateMetadata = async ({ params }: { params: { lang: string } }): Promise<Metadata> => {
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

export default function RootLayout({ children, params }: { children: React.ReactNode; params: { lang: string } }) {
	const lang = params.lang === "en" ? "en" : "ru"; // Берём язык из URL

	return (
		<html lang={lang}>
			<body>
				<HudMenu />
				<InteractiveLines />
				<Preloader />
				{children}
				<script src="/customJs/initial-preloader.js" />
			</body>
		</html>
	);
}
