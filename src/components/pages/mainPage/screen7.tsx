"use client";

import styles from "./styles.module.scss";
import { usePreloaderStore } from "@/store/preloaderStore";
import { useEffect } from "react";
import { useWindowStore } from "@/store/windowStore";
import { useAllOptionsStore } from "@/store/allOptionsStore";
import { useContactsPageStore } from "@/store/contactsPageStore";
import parse from "html-react-parser";

export default function Screen7({ language }: { language: string }) {
	const { markReady } = usePreloaderStore();
	const { isMobile } = useWindowStore();
	const { footerData, isLoading } = useAllOptionsStore();
	const { data, fetchData } = useContactsPageStore();

	/* eslint-disable react-hooks/exhaustive-deps */
	useEffect(() => {
		if (isLoading === false) {
			markReady();
		}
	}, [isLoading]);

	useEffect(() => {
		fetchData(language);
	}, []);
	/* eslint-enable react-hooks/exhaustive-deps */

	interface Contact {
		acf_fc_layout: string;
		text: string;
		link?: string;
	}

	const ContactItem: React.FC<{ contact: Contact }> = ({ contact }) => {
		switch (contact.acf_fc_layout) {
			case "phone":
				return (
					<a href={`tel:${contact.text.replace(/\D/g, "")}`} className={styles.text}>
						{contact.text}
					</a>
				);
			case "mail":
				return (
					<a href={`mailto:${contact.text}`} className={styles.text}>
						{contact.text}
					</a>
				);
			default:
				if (contact.link && contact.link !== "") {
					return (
						<a href={contact.link} className={styles.text}>
							{contact.text}
						</a>
					);
				} else {
					return <div className={styles.text}>{contact.text}</div>;
				}
		}
	};

	return (
		<>
			<div
				className={`screen ${styles.screen7}`}
				data-screen-lightness="light"
				data-lines-index={isMobile ? 1 : 1}
				data-mini-line-rotation={-45}
				data-position-x={isMobile ? 50 : 50}
				data-position-y={50}
				data-horizontal-x={isMobile ? 50 : 50}
				data-horizontal-width={isMobile ? 100 : 100}
				data-vertical-height={isMobile ? 100 : 100}
				data-lines-color={"dark"}
				data-left-line-x={0}
				data-left-line-height={isMobile ? 0 : 100}
				data-right-line-x={100}
				data-right-line-height={isMobile ? 0 : 100}
			>
				<div className={`screenContent ${styles.screenContent}`}>
					<div className={styles.logoBlock}>
						<div className={styles.logo}>
							{Array.from({ length: 7 }).map((_, i) => {
								const letter = footerData?.letters?.[i];
								return (
									<div className={styles.letter} key={i}>
										<img className={letter?.image ? styles.animated : ""} src={`/images/mainPage/screen7/letter${i + 1}.svg`} alt="" />
										{letter?.image && <img src={letter.image.url} alt={letter.image.name} />}
									</div>
								);
							})}
						</div>
					</div>
					<div className={`${styles.adressesBlock} noScreenScrollZone`}>
						<div className={styles.adressItems}>
							{data?.contacts_page?.map_items &&
								data?.contacts_page?.map_items?.map((item, index) => {
									return (
										<div className={`${styles.adressItem} scrollable`} key={index}>
											<div className={styles.adress}>{parse(item.adress || "")}</div>
											<ul className={styles.phones}>
												{item.contacts &&
													item.contacts.map((contact, index) => (
														<li className={styles.phone} key={index}>
															<ContactItem contact={contact} />
														</li>
													))}
											</ul>
										</div>
									);
								})}
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
