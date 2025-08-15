// src\app\[language]\about\components\PartnersScreen.tsx"

import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./styles.module.scss";
import parse from "html-react-parser";
import { Person } from "@/store/aboutPageStore";
import { useWindowStore } from "@/store/windowStore";

export default function TeamScreen({ data, language }: { data: Person[]; language: string }) {
	const [activePersonIndex, setActivePersonIndex] = useState(0);
	const { isMobile } = useWindowStore();

	useEffect(() => {}, [activePersonIndex]);
	if (!data) return <div>Данные не загружены</div>;

	return (
		<div
			className={`screen active ${styles.screen} ${styles.teamScreen} ${styles.active} `}
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
				<div className={styles.photoBlock}>
					{data?.map((person, index) => {
						return (
							<div className={`${styles.photo} ${index === activePersonIndex ? styles.active : ""}`} key={`photo_person_${index}`}>
								{person.image ? (
									<img src={person.image} alt={`Hubarch ${person.name}`} />
								) : (
									<img src="/images/mainPage/screen5/placeholder.png" alt={`Hubarch ${person.name}`} />
								)}
							</div>
						);
					})}
				</div>
				<div className={styles.listBlock}>
					{data?.map((person, index) => {
						return (
							<div
								className={`${styles.littlePhoto} ${index === activePersonIndex ? styles.active : ""}`}
								key={`little_photo_person_${index}`}
								onClick={() => {
									setActivePersonIndex(index);
								}}
							>
								{person.image ? (
									<img src={person.image} alt={`Hubarch ${person.name}`} />
								) : (
									<img src="/images/mainPage/screen5/placeholder.png" alt={`Hubarch ${person.name}`} />
								)}
							</div>
						);
					})}
					<div
						className={styles.frame}
						style={{
							top: !isMobile ? `calc(${activePersonIndex} * var(--littlePhotoHeight) + ${activePersonIndex} * var(--listBlockGap))` : "",
							left: isMobile ? `calc(${activePersonIndex} * var(--littlePhotoWidth) + ${activePersonIndex} * var(--listBlockGap))` : "",
						}}
					>
						<div className={styles.topLeft} />
						<div className={styles.topRight} />
						<div className={styles.bottomRight} />
						<div className={styles.bottomLeft} />
					</div>
				</div>
				<div className={styles.infoBlock}>
					{data?.map((person, index) => {
						return (
							<div className={`${styles.infoPerson} ${index === activePersonIndex ? styles.active : ""}`} key={`info_person_${index}`}>
								<div className={styles.quoteBlock}>{parse(person.quote)}</div>
								<div className={styles.nameBlock}>
									<div className={styles.name}>{person.name}</div>
									<div className={styles.position}>{person.position}</div>
									{person.contacts != false &&
										person.contacts.map((contact, contactIndex) => {
											return contact.acf_fc_layout === "mail" ? (
												<a href={`mailto:${contact.contact}`} className={styles.contact} key={`person_${index}_contact_${contactIndex}`}>
													{contact.contact}
												</a>
											) : (
												<a href={`tel:${contact.contact}`} className={styles.contact} key={`person_${index}_contact_${contactIndex}`}>
													{contact.contact}
												</a>
											);
										})}
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}
