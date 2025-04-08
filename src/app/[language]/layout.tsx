// src/app/[language]/layout.tsx
import { ReactNode } from "react";

type Props = {
	children: ReactNode;
	params: Promise<{
		language: string;
	}>;
};

export default async function LanguageLayout({ children, params }: Props) {
	const resolvedParams = await params;

	return (
		<html lang={resolvedParams.language}>
			<body>{children}</body>
		</html>
	);
}
