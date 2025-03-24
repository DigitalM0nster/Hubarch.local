import MainPageClient from "@/components/pages/mainPage/mainPageClient";

export function generateStaticParams() {
	return [{ language: "ru" }, { language: "en" }];
}

export default function Home(props: unknown) {
	const { language } = (props as { params: { language: string } }).params;

	return <MainPageClient key={language} language={language} />;
}
