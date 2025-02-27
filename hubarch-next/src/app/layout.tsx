import type { Metadata } from "next";
import "./styles.scss";
import HudMenu from "@/components/hudMenu/HudMenu";

export const metadata: Metadata = {
	title: "Hubarch – Инновационные проекты",
	description: "Создаём лучшие цифровые решения для бизнеса.",
	openGraph: {
		title: "Hubarch – Инновационные проекты",
		description: "Создаём лучшие цифровые решения для бизнеса.",
		url: "https://hubarch.local",
		siteName: "Hubarch",
		images: [
			{
				url: "/images/logo.svg",
				width: 1200,
				height: 630,
			},
		],
		type: "website",
	},
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="ru">
			<body>
				<HudMenu />
				<div className="screen">{children}</div>
			</body>
		</html>
	);
}
