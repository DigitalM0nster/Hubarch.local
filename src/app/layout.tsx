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
		title: {
			default: "Hubarch — Архитектурная студия | Дизайн интерьеров и проектирование",
			template: "%s | Hubarch",
		},
		description:
			"Hubarch - архитектурная студия с 2013 года. Создаем уникальные пространства: архитектурные проекты, дизайн интерьеров, коммерческие пространства. Более 238 000 м² реализованных проектов.",
		keywords: [
			"архитектурная студия",
			"дизайн интерьеров",
			"архитектурные проекты",
			"интерьерные проекты",
			"коммерческие пространства",
			"офисные интерьеры",
			"коворкинги",
			"рестораны",
			"отели",
			"торговые центры",
			"проектирование",
			"авторский надзор",
			"3D визуализация",
			"рабочая документация",
		],
		authors: [{ name: "Hubarch" }],
		creator: "Hubarch",
		publisher: "Hubarch",
		robots: {
			index: true,
			follow: true,
			googleBot: {
				index: true,
				follow: true,
				"max-video-preview": -1,
				"max-image-preview": "large",
				"max-snippet": -1,
			},
		},
		openGraph: {
			type: "website",
			locale: language === "en" ? "en_US" : "ru_RU",
			url: `${siteUrl}/${language}`,
			title: "Hubarch — Архитектурная студия | Дизайн интерьеров и проектирование",
			description:
				"Hubarch - архитектурная студия с 2013 года. Создаем уникальные пространства: архитектурные проекты, дизайн интерьеров, коммерческие пространства. Более 238 000 м² реализованных проектов.",
			siteName: "Hubarch",
			images: [
				{
					url: `${siteUrl}/images/hubarch_logo_png.png`,
					width: 1200,
					height: 630,
					alt: "Hubarch - Архитектурная студия",
				},
			],
		},
		twitter: {
			card: "summary_large_image",
			title: "Hubarch — Архитектурная студия | Дизайн интерьеров и проектирование",
			description: "Hubarch - архитектурная студия с 2013 года. Создаем уникальные пространства: архитектурные проекты, дизайн интерьеров, коммерческие пространства.",
			images: [`${siteUrl}/images/hubarch_logo_png.png`],
		},
		alternates: {
			canonical: `${siteUrl}/${language}`,
			languages: {
				ru: `${siteUrl}/ru`,
				en: `${siteUrl}/en`,
			},
		},
		metadataBase: new URL(siteUrl || "https://hubarch.ru"),
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
			<head>
				{/* Дополнительные мета-теги для лучшего SEO */}
				<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
				<meta name="theme-color" content="#fbf9f4" />
				<meta name="color-scheme" content="light" />

				{/* Favicon и иконки */}
				<link rel="icon" type="image/svg+xml" href="/images/hubarch_logo.svg" />
				<link rel="icon" type="image/png" sizes="32x32" href="/images/hubarch_logo_png.png" />
				<link rel="icon" type="image/png" sizes="16x16" href="/images/hubarch_logo_png.png" />
				<link rel="apple-touch-icon" sizes="180x180" href="/images/hubarch_logo_png.png" />
				<link rel="manifest" href="/manifest.json" />

				{/* Предзагрузка важных ресурсов */}
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

				{/* Структурированные данные для поисковых систем */}
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{
						__html: JSON.stringify({
							"@context": "https://schema.org",
							"@type": "ArchitectureFirm",
							name: "Hubarch",
							description: "Архитектурная студия с 2013 года. Создаем уникальные пространства: архитектурные проекты, дизайн интерьеров, коммерческие пространства.",
							url: siteUrl,
							logo: `${siteUrl}/images/hubarch_logo_png.png`,
							foundingDate: "2013",
							address: {
								"@type": "PostalAddress",
								addressLocality: "Санкт-Петербург",
								addressCountry: "RU",
							},
							contactPoint: {
								"@type": "ContactPoint",
								telephone: "+7 (981) 768-68-58",
								contactType: "customer service",
								email: "hello@hubarch.ru",
							},
							serviceArea: {
								"@type": "Country",
								name: "Россия",
							},
							hasOfferCatalog: {
								"@type": "OfferCatalog",
								name: "Архитектурные услуги",
								itemListElement: [
									{
										"@type": "Offer",
										itemOffered: {
											"@type": "Service",
											name: "Архитектурное проектирование",
										},
									},
									{
										"@type": "Offer",
										itemOffered: {
											"@type": "Service",
											name: "Дизайн интерьеров",
										},
									},
									{
										"@type": "Offer",
										itemOffered: {
											"@type": "Service",
											name: "3D визуализация",
										},
									},
								],
							},
						}),
					}}
				/>
			</head>
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
