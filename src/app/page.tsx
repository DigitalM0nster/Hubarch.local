import { redirect } from "next/navigation";
export function generateStaticParams() {
	return [{ language: "ru" }, { language: "en" }]; // Доступные языки
}

export default function Home() {
	redirect("/ru");
}
