// next.config.ts
import type { NextConfig } from "next";

// process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const nextConfig: NextConfig = {
	// output: "export",
	output: "standalone",
	env: {
		SITE_URL: process.env.SITE_URL,
	},
	eslint: {
		ignoreDuringBuilds: true,
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
