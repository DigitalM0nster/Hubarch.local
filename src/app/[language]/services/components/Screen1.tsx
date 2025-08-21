"use client";

import Faq from "@/components/faq/Faq";
import styles from "./styles.module.scss";
import { useServicesPageStore } from "@/store/servicesPageStore";
import parse from "html-react-parser";
import { useWindowStore } from "@/store/windowStore";

export default function Screen1({ language, text_is_light = false }: { language: string; text_is_light?: boolean }) {
	const { data } = useServicesPageStore();
	const { isMobile } = useWindowStore();
	return (
		<div
			className={`screen active ${styles.screen} ${styles.screen1}`}
			data-screen-lightness={text_is_light ? "dark" : "light"}
			data-lines-index={isMobile ? 0 : 1}
			data-lines-opacity={isMobile ? 0.25 : 1}
			data-mini-line-rotation={-45}
			data-position-x={isMobile ? 50 : 25}
			data-position-y={50}
			data-vertical-y={isMobile ? 50 : 40}
			data-horizontal-x={isMobile ? 50 : 25}
			data-horizontal-width={isMobile ? 100 : 50}
			data-vertical-height={isMobile ? 100 : 60}
			data-lines-color={text_is_light ? "light" : "dark"}
			data-left-line-x={0}
			data-left-line-height={0}
			data-right-line-x={100}
			data-right-line-height={0}
		>
			<div className={`screenContent ${styles.screenContent}`}>
				<div className={styles.leftPart}>
					<div className={`${styles.titleBackground} titleBackground`}>{data?.services_page_screen1?.left_block?.background_title}</div>
					{data?.services_page_screen1?.left_block?.text && <div className={styles.text}>{parse(data?.services_page_screen1?.left_block?.text)}</div>}
				</div>
				<div className={styles.rightPart}>
					<Faq faqData={data?.services_page_screen1?.right_block_faq} />
				</div>
			</div>
		</div>
	);
}
