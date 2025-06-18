// src\app\[language]\about\components\PartnersScreen.tsx"

import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./styles.module.scss";
import { Partner } from "@/store/aboutPageStore";
import parse from "html-react-parser";

interface PartnersScreenData {
	text: string;
	partners: Partner[] | false;
}

export default function PartnersScreen({ data, language }: { data: PartnersScreenData; language: string }) {
	if (!data) return <div>Данные не загружены</div>;

	return (
		<div
			className={`screen ${styles.screen} ${styles.partnersScreen}`}
			data-screen-lightness="light"
			data-lines-index={1}
			data-mini-line-rotation={-45}
			data-position-x={50}
			data-position-y={50}
			data-vertical-y={50}
			data-horizontal-x={50}
			data-horizontal-width={100}
			data-vertical-height={100}
			data-lines-color={"dark"}
			data-left-line-x={0}
			data-left-line-height={0}
			data-right-line-x={0}
			data-right-line-height={0}
			data-lines-opacity={1}
		>
			<div className={`screenContent ${styles.screenContent}`}>
				<div className={styles.partnersBlock}>
					{data.partners != false &&
						data.partners.map((partner, index) => {
							return (
								<div className={styles.partnerItem} key={`partner_${index}`}>
									{partner.image && <img src={partner.image} alt="hubarch partner" />}
								</div>
							);
						})}
				</div>
				{data.text && (
					<div className={styles.textBlock}>
						<div className={styles.text}>{parse(data.text)}</div>
					</div>
				)}
			</div>
		</div>
	);
}
