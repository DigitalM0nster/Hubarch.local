"use client";

import { useRouter } from "next/navigation";
import { preloaderStore } from "@/store/preloaderStore";
import { MouseEvent } from "react";
import { useHudMenuStore } from "@/store/hudMenuStore";

type Props = {
	href: string;
	children: React.ReactNode;
	className?: string;
	customClick?: () => void;
	customMouseEnter?: () => void;
};

export default function LinkWithPreloader({ href, children, className, customClick, customMouseEnter }: Props) {
	const router = useRouter();
	const { setActiveMenu } = useHudMenuStore();

	const handleClick = async (e: MouseEvent<HTMLAnchorElement>) => {
		e.preventDefault();
		await preloaderStore.triggerReset();
		if (customClick) {
			await Promise.resolve(customClick());
		}
		router.push(href);
		setActiveMenu(false);
	};

	return (
		<a href={href} onClick={handleClick} className={className} onMouseEnter={customMouseEnter!}>
			{children}
		</a>
	);
}
