// src\app\[language]\about\components\SpacesScreen.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./styles.module.scss";
import parse from "html-react-parser";
import { Position } from "@/store/aboutPageStore";

interface SpaceScreenData {
	title: string;
	image: string | false;
	person: {
		quote: string;
		name: string;
		position: Position[] | false;
	};
}

export default function SpacesScreen({ data, language }: { data: SpaceScreenData; language: string }) {
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
						{data.image != false ? (
							<img src={data.image} alt="hubarch создание пространств" />
						) : (
							<img src="/images/spaces_image.png" alt="hubarch создание пространств" />
						)}
						<div className={styles.title}>{data.title}</div>
					</div>
					<div className={styles.textBlock}>
						<div className={styles.text}>{parse(data.person.quote)}</div>
						<div className={styles.person}>
							<div className={styles.name}>{data.person.name}</div>
							{data.person.position != false &&
								data.person.position.map((text, index) => {
									// console.log(text);
									return (
										// <></>
										<div className={styles.position} key={`person_position_${index}`}>
											{text.text}
										</div>
									);
								})}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
