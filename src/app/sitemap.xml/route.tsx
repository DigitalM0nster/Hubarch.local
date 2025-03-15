import { NextResponse } from "next/server";

const siteUrl = process.env.SITE_URL || "https://hubarch.local";

export async function GET() {
	// 🔹 Статичные страницы
	const staticPages = ["", "about", "projects", "services", "contacts"];
	const locales = ["ru", "en"];

	// 🔹 Динамические страницы (например, проекты)
	const projectsRes = await fetch(`${siteUrl}/wp-json/wp/v2/projects`);
	const projects = await projectsRes.json();

	// 🔹 Генерируем URL для статичных страниц
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

	// 🔹 Генерируем URL для динамических страниц (проекты)
	const projectUrls = locales.flatMap((lang) =>
		projects.map((project: any) => {
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

	// 🛠️ Собираем `sitemap.xml`
	const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
		<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
			${staticUrls.join("")}
			${projectUrls.join("")}
		</urlset>`;

	// 🔥 Отдаём ответ с XML
	return new NextResponse(sitemap, {
		headers: { "Content-Type": "application/xml" },
	});
}
