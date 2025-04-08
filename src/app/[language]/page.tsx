import MainPageClient from "@/components/pages/mainPage/mainPageClient";
import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://hubarch.local";

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
			title: "Hubarch — Главная",
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

export default async function Home({ params }: Props) {
	const { language } = await params;
	return <MainPageClient key={language} language={language} />;
}
