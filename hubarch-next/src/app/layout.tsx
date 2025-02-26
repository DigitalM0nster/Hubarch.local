import type { Metadata } from "next";
import "./styles.scss"; // Подключаем глобальные стили
import Header from "@/components/Header";

export const metadata: Metadata = {
	title: "Hubarch - Главная",
	description: "Добро пожаловать на сайт Hubarch!",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="ru">
			<body>
				<Header />
				<div className="container">{children}</div>
			</body>
		</html>
	);
}
