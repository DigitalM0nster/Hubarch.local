"use client";

import styles from "./styles.module.scss";
import { usePreloaderStore } from "@/store/preloaderStore";
import { useEffect } from "react";
import LinkWithPreloader from "@/components/preloader/LinkWithPreloader";
import { useWindowStore } from "@/store/windowStore";
import parse from "html-react-parser";

export default function NextPageScreen({ language, data }: { language: string; data: any }) {
	const { isMobile } = useWindowStore();

	return (
		<>
			<div
				className={`screen nextPageScreen ${styles.nextPageScreen}`}
				data-screen-lightness="light"
				data-lines-index={isMobile ? 0 : 1}
				data-mini-line-rotation={-45}
				data-position-x={isMobile ? 50 : 50}
				data-position-y={isMobile ? 50 : 33.3}
				data-horizontal-x={isMobile ? 50 : 50}
				data-horizontal-width={isMobile ? 100 : 100}
				data-vertical-height={isMobile ? 100 : 100}
				data-lines-color={"dark"}
				data-left-line-x={0}
				data-left-line-height={0}
				data-right-line-x={100}
				data-right-line-height={0}
			>
				<div className={`screenContent ${styles.screenContent}`}>
					<LinkWithPreloader href={data.link.url} className={styles.imageBlock}>
						<div className={styles.image}>
							<img src={data.image != false ? data.image : "/images/next_page_template.png"} alt="" />
						</div>
						<div className={styles.buttonBlock}>
							<div className={styles.button}>
								<div className={styles.icon} />
								<div className={styles.text}>Перейти</div>
							</div>
							<div className={styles.pageName}>{data.link.title}</div>
						</div>
					</LinkWithPreloader>
					{data.text && <div className={styles.textBlock}>{parse(data.text)}</div>}
				</div>
			</div>
		</>
	);
}
