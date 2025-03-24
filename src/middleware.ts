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
		pathname.startsWith("/sitemap.xml")
	) {
		return NextResponse.next();
	}

	// Разрешённые языки
	if (pathname === "/" || pathname.startsWith("/ru") || pathname.startsWith("/en")) {
		return NextResponse.next();
	}

	// Всё остальное считаем 404
	return NextResponse.rewrite(new URL("/not-found", request.url));
}

export const config = {
	matcher: ["/((?!_next|api|favicon.ico|robots.txt|sitemap.xml).*)"],
};
