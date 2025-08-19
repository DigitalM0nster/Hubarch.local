import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	// Разрешаем доступ к статике и API
	if (
		pathname.startsWith("/_next") ||
		pathname.startsWith("/api") ||
		pathname.startsWith("/images") ||
		pathname.startsWith("/fonts") ||
		pathname.startsWith("/customJs") ||
		pathname.startsWith("/favicon.ico") ||
		pathname.startsWith("/robots.txt") ||
		pathname.startsWith("/sitemap.xml") ||
		pathname.startsWith("/manifest.json")
	) {
		return NextResponse.next();
	}

	// Разрешённые языки
	if (pathname === "/" || pathname.startsWith("/ru") || pathname.startsWith("/en")) {
		return NextResponse.next();
	}

	// Проверяем, является ли путь страницей проекта
	if (pathname.includes("/projects/")) {
		const response = NextResponse.next();

		// Устанавливаем заголовки для предотвращения кеширования
		response.headers.set("Cache-Control", "no-store, must-revalidate");
		response.headers.set("Pragma", "no-cache");
		response.headers.set("Expires", "0");

		return response;
	}

	// Всё остальное считаем 404
	return NextResponse.rewrite(new URL("/not-found", request.url));
}

export const config = {
	matcher: ["/((?!_next|api|favicon.ico|robots.txt|sitemap.xml|manifest.json).*)"],
};
