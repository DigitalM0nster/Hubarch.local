// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	// output: "export",
	output: "standalone",
	env: {
		SITE_URL: process.env.SITE_URL,
	},
	async redirects() {
		return [
			{
				source: "/",
				destination: "/ru",
				permanent: true, // 301 редирект (SEO-friendly)
			},
		];
	},
};

export default nextConfig;
