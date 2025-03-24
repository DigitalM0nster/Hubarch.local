import { NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // 🚨 запретить пререндер на этапе build

const siteUrl = process.env.SITE_URL || "https://hubarch.local";

export async function GET() {
	const staticPages = ["", "about", "projects", "services", "contacts"];
	const locales = ["ru", "en"];

	type Project = {
		id: number;
		slug: string;
		modified?: string;
		title?: string;
		acf?: unknown;
	};

	let projects: Project[] = [];

	try {
		const res = await fetch(`${siteUrl}/wp-json/wp/v2/projects`);
		if (res.ok) {
			projects = await res.json();
		} else {
			console.error("Не удалось получить проекты для sitemap");
		}
	} catch (e) {
		console.error("Ошибка загрузки проектов для sitemap:", e);
	}

	const staticUrls = locales.flatMap((lang) =>
		staticPages.map((page) => {
			const path = page ? `/${lang}/${page}/` : `/${lang}/`;
			return `
				<url>
					<loc>${siteUrl}${path}</loc>
					<lastmod>${new Date().toISOString()}</lastmod>
					<changefreq>${page === "projects" ? "weekly" : "monthly"}</changefreq>
				</url>
			`;
		})
	);

	const projectUrls = locales.flatMap((lang) =>
		projects.map((project) => {
			const path = `/${lang}/projects/${project.slug}/`;
			return `
				<url>
					<loc>${siteUrl}${path}</loc>
					<lastmod>${project.modified || new Date().toISOString()}</lastmod>
					<changefreq>weekly</changefreq>
				</url>
			`;
		})
	);

	const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
		<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
			${staticUrls.join("")}
			${projectUrls.join("")}
		</urlset>`;

	return new NextResponse(sitemap, {
		headers: { "Content-Type": "application/xml" },
	});
}
