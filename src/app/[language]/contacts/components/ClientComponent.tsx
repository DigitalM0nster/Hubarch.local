"use client";

import { useDetectMobile } from "@/hooks/useDetectMobile";
import { useScreenInit } from "@/hooks/useScreenInit";
import { useScreenScroll } from "@/hooks/useScreenScroll";
import { usePreloaderStore } from "@/store/preloaderStore";
import { useScrollStore } from "@/store/scrollStore";
import { useWindowStore } from "@/store/windowStore";
import { useEffect, useRef, useState } from "react";
import styles from "./styles.module.scss";
import { useContactsPageStore } from "@/store/contactsPageStore";
import parse from "html-react-parser";
import YandexMap from "./YandexMap";
import ApplicationComponent from "@/components/applicationComponent/ApplicationComponent";
import { usePageReady } from "@/hooks/usePageReady";

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
	const { setPageState } = usePreloaderStore();
	const { scrollAllowed, setScrollAllowed } = useScrollStore();
	const { windowWidth } = useWindowStore();
	const { data, contactsPageFetchingFinished, fetchData } = useContactsPageStore();
	const { isMobile } = useWindowStore();
	const [activeMapItem, setActiveMapItem] = useState<number | null>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	// Используем хук для проверки готовности страницы
	// Передаем массив зависимостей, которые должны быть загружены
	const pageReady = usePageReady([data], containerRef);

	useEffect(() => {
		fetchData(language);
	}, []);

	// Устанавливаем pageState = "ready" только когда страница полностью готова
	useEffect(() => {
		if (pageReady) {
			setPageState("ready");
			setScrollAllowed(true);
		} else {
			setPageState("loading");
			setScrollAllowed(false);
		}
	}, [pageReady]);

	useEffect(() => {
		const screenScroll = document.querySelector(".screenScroll");
		if (scrollAllowed) {
			screenScroll?.classList.remove("noScroll");
		} else {
			screenScroll?.classList.add("noScroll");
		}
	}, [scrollAllowed]);

	useEffect(() => {
		if (isMobile) {
			setActiveMapItem(0);
		} else {
			setActiveMapItem(null);
		}
	}, [isMobile]);

	return (
		<>
			<div ref={containerRef} className="screenScroll simpleScroll" style={{ backgroundColor: data?.contacts_page?.page_main_settings?.background_color || "transparent" }}>
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
					<div className={`screenContent ${styles.screenContent}`}>
						{isMobile && data?.contacts_page?.map_items && data?.contacts_page?.map_items?.length > 0 && (
							<div className={styles.mapButtons}>
								{data?.contacts_page?.map_items?.map((item, index) => {
									return (
										<div
											className={`${styles.mapButton} ${activeMapItem === index ? styles.active : ""}`}
											key={`map_button_${index}`}
											onClick={() => {
												setActiveMapItem(index);
											}}
										>
											{item.title}
										</div>
									);
								})}
							</div>
						)}
						<div className={styles.mapBlock}>
							{data?.contacts_page?.map_items &&
								data?.contacts_page?.map_items?.map((item, index) => {
									return (
										<div className={`${styles.mapItem} ${activeMapItem === index ? styles.active : ""}`} key={`map_item_${index}`}>
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
			</div>
		</>
	);
}
