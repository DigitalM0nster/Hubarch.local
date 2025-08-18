// src\app\[language]\approach\page.tsx

import type { Metadata } from "next";
import ApproachPageClient from "./components/ApproachPageClient";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

type Props = {
	params: Promise<{
		language: string;
	}>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { language } = await params;
	return {
		title: "Hubarch — Наш подход к проектированию | 8 этапов работы",
		description:
			"Узнайте о нашем профессиональном подходе к архитектурным и интерьерным проектам. От первой встречи до авторского надзора - 8 четких этапов реализации вашего проекта.",
		openGraph: {
			title: "Hubarch — Наш подход к проектированию | 8 этапов работы",
			description:
				"Узнайте о нашем профессиональном подходе к архитектурным и интерьерным проектам. От первой встречи до авторского надзора - 8 четких этапов реализации вашего проекта.",
			url: `${siteUrl}/${language}/approach`,
			images: [
				{
					url: `${siteUrl}/images/approach/background.svg`,
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

export default async function Approach({ params }: Props) {
	const { language } = await params;
	return <ApproachPageClient key={language} language={language} />;
}
