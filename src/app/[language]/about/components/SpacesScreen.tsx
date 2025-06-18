// src\app\[language]\about\components\SpacesScreen.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./styles.module.scss";

export default function SpacesScreen() {
	// if (!data) return <div>Данные не загружены</div>;

	return (
		<div
			className={`screen ${styles.screen} ${styles.spacesScreen}`}
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
				<div className={styles.circleBlock}>
					<div className={styles.image}>
						<div className={styles.backgroundCircle} />
						<img src="/images/spaces_image.png" alt="hubarch создание пространств" />
						<div className={styles.title}>Мы создаем пространства</div>
					</div>
					<div className={styles.textBlock}>
						<div className={styles.text}>
							Где каждый человек чувствует себя неотъемлемой частью общего целого, где эстетика, комфорт и гармония не оставляют его равнодушным. Наш акцент на
							качестве, соблюдении сроков и чутко выстроенная концепция позволяют каждому проекту стать особым.
						</div>
						<div className={styles.person}>
							<div className={styles.name}>Павел Губаревич</div>
							<div className={styles.position}>CEO / руководитель AMG</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
