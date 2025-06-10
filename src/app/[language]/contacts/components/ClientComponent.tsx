"use client";

import { useDetectMobile } from "@/hooks/useDetectMobile";
import { useScreenInit } from "@/hooks/useScreenInit";
import { useScreenScroll } from "@/hooks/useScreenScroll";
import { usePreloaderStore } from "@/store/preloaderStore";
import { useScrollStore } from "@/store/scrollStore";
import { useWindowStore } from "@/store/windowStore";
import { useEffect } from "react";
import styles from "./styles.module.scss";
import { useContactsPageStore } from "@/store/contactsPageStore";
import parse from "html-react-parser";
import YandexMap from "./YandexMap";
import ApplicationComponent from "@/components/applicationComponent/ApplicationComponent";

// Компонент для отображения контактной информации
const ContactItem = ({ contact }: { contact: { acf_fc_layout: string; text: string; link?: string } }) => {
	// Определяем тип контакта на основе acf_fc_layout
	switch (contact.acf_fc_layout) {
		case "phone":
			// Для телефона используем тег <a> с href="tel:"
			return (
				<a href={`tel:${contact.text.replace(/\D/g, "")}`} className={styles.text}>
					{contact.text}
				</a>
			);
		case "mail":
			// Для почты используем тег <a> с href="mailto:"
			return (
				<a href={`mailto:${contact.text}`} className={styles.text}>
					{contact.text}
				</a>
			);
		default:
			// Для обычного текста используем div
			if (contact.link && contact.link != "") {
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

export default function ClientComponent({ language }: { language: string }) {
	useScreenScroll(styles);
	useScreenInit();
	useDetectMobile();
	const { setTotal, markReady } = usePreloaderStore();
	const { scrollAllowed } = useScrollStore();
	const { windowWidth } = useWindowStore();
	const { data, contactsPageFetchingFinished, fetchData } = useContactsPageStore();
	const { isMobile } = useWindowStore();
	useEffect(() => {
		fetchData(language);
		setTotal(0);
		markReady();
	}, []);

	useEffect(() => {
		const screenScroll = document.querySelector(".screenScroll");
		if (scrollAllowed) {
			screenScroll?.classList.remove("noScroll");
		} else {
			screenScroll?.classList.add("noScroll");
		}
	}, [scrollAllowed]);

	useEffect(() => {}, [windowWidth]);

	return (
		<>
			<div
				className={`screen active ${styles.screen} ${styles.screen1}`}
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
				data-lines-opacity={0.0}
			>
				<div className="screenContent">
					<div className={styles.mapBlock}>
						{data?.contacts_page?.map_items &&
							data?.contacts_page?.map_items?.map((item, index) => {
								return (
									<div className={styles.mapItem} key={`map_item_${index}`}>
										<div className={styles.map}>
											<YandexMap
												coordinates={[
													item.coordinates?.coordinate1 ? Number(item.coordinates.coordinate1) : 55.752023,
													item.coordinates?.coordinate2 ? Number(item.coordinates.coordinate2) : 37.617499,
												]}
											/>
											{item.title && <div className={styles.title}>{item.title}</div>}
										</div>
										<div className={styles.textBlock}>
											<div className={styles.adress}>{parse(item.adress || "")}</div>
											<div className={styles.contacts}>
												{item.contacts &&
													item.contacts.map((contact, index) => (
														<div className={styles.contact} key={`contact_${index}`}>
															<ContactItem contact={contact} />
														</div>
													))}
											</div>
										</div>
									</div>
								);
							})}
					</div>
				</div>
			</div>
			{isMobile && <ApplicationComponent language={language} data={data?.contacts_page?.application} />}
		</>
	);
}
