"use client";

import styles from "./styles.module.scss";
import { usePathname } from "next/navigation";
import { useAllOptionsStore } from "@/store/allOptionsStore";
import { useEffect, useRef, useState } from "react";
import { useHudMenuStore } from "@/store/hudMenuStore";
import { useInteractiveLinesStore } from "@/store/interactiveLinesStore";
import LinkWithPreloader from "../preloader/LinkWithPreloader";
import Image from "next/image";
import { useScrollStore } from "@/store/scrollStore";
import { usePreloaderStore } from "@/store/preloaderStore";
import PopupHud from "./PopupHud";

export default function MobileHud({ language }: { language: string }) {
	const pathname = usePathname(); // Получаем текущий путь
	const { menuSettingsData, popupData } = useAllOptionsStore();
	const { activeMenu, setActiveMenu, screenLightness, activePopup, setActivePopup } = useHudMenuStore();
	const { zIndex, setNewIndex } = useInteractiveLinesStore();
	const { setScrollAllowed } = useScrollStore();
	const { progress } = usePreloaderStore();
	const lang = language;

	const savedZIndex = useRef(zIndex);

	/* eslint-disable react-hooks/exhaustive-deps */
	useEffect(() => {
		if (activeMenu) {
			savedZIndex.current = zIndex;
			setScrollAllowed(false);
		} else {
			setNewIndex(savedZIndex.current);
			if (progress >= 100) {
				setScrollAllowed(true);
			}
		}
	}, [activeMenu]);
	/* eslint-enable react-hooks/exhaustive-deps */

	return (
		<>
			<div className={`${styles.mobileHud} ${screenLightness === "light" ? styles.dark : styles.light}`}>
				<LinkWithPreloader href={lang === "ru" ? "/ru" : "/en"} className={styles.logo}>
					{menuSettingsData?.top_menu_logo.mobile_logo.logo_light ? (
						<img
							className={`${styles.imgLogo} ${screenLightness === "dark" ? styles.active : ""}`}
							src={menuSettingsData.top_menu_logo.mobile_logo.logo_light}
							alt="Hubarch logo"
						/>
					) : (
						<img className={`${styles.imgLogo} ${screenLightness === "dark" ? styles.active : ""}`} src="/images/hubarch_logo_mobile_light.svg" alt="Hubarch logo" />
					)}

					{menuSettingsData?.top_menu_logo.mobile_logo.logo_dark ? (
						<img
							className={`${styles.imgLogo} ${screenLightness === "light" ? styles.active : ""}`}
							src={menuSettingsData.top_menu_logo.mobile_logo.logo_dark}
							alt="Hubarch logo"
						/>
					) : (
						<img className={`${styles.imgLogo} ${screenLightness === "light" ? styles.active : ""}`} src="/images/hubarch_logo_mobile_dark.svg" alt="Hubarch logo" />
					)}
				</LinkWithPreloader>
				<div
					className={`${styles.burgerButtonBlock} ${activeMenu ? styles.active : ""}`}
					onClick={() => {
						setActiveMenu(!activeMenu);
					}}
				>
					<div className={styles.textBlock}>
						<div className={`${styles.text} ${styles.close}`}>{lang === "ru" ? "Закрыть" : "Close"}</div>
						<div className={`${styles.text} ${styles.open}`}>{lang === "ru" ? "Меню" : "Menu"}</div>
					</div>
					<div className={styles.burger}>
						<div className={styles.line} />
						<div className={styles.line} />
						<div className={styles.line} />
					</div>
				</div>
			</div>
			<div className={`${styles.mobileMenu} mobileMenu ${activeMenu ? `${styles.active} active` : ""}`}>
				<div className={`screenContent ${styles.menuContent}`}>
					<div className={styles.languageBlock}>
						<LinkWithPreloader href={pathname.replace(/^\/en/, "/ru")} className={`${styles.lang} ${lang === "ru" ? styles.active : ""}`}>
							Ru
						</LinkWithPreloader>
						<div className={styles.separator}>/</div>
						<LinkWithPreloader href={pathname.replace(/^\/ru/, "/en")} className={`${styles.lang} ${lang === "en" ? styles.active : ""}`}>
							Eng
						</LinkWithPreloader>
					</div>
					<div className={styles.navigationBlock}>
						<LinkWithPreloader href={lang === "ru" ? "/ru" : "/en"} className={styles.li}>
							{lang === "ru" ? "Главная" : "Main"}
						</LinkWithPreloader>
						{menuSettingsData?.top_menu_links &&
							menuSettingsData?.top_menu_links.map((linkItem, index) => {
								const link = linkItem.link;
								const url = lang === "ru" ? link?.ru?.url : link?.en?.url;
								const formattedUrl = url === "/ru/home" || url === "/en/home" ? url.slice(0, 3) : url; // Проверка на главную страницу
								return (
									<LinkWithPreloader href={formattedUrl} key={`link${index}`} className={styles.li}>
										{lang === "ru" ? link?.ru?.title : link?.en?.title}
									</LinkWithPreloader>
								);
							})}
						{menuSettingsData?.right_menu_links &&
							menuSettingsData?.right_menu_links.map((linkItem, index) => {
								const link = linkItem.link;

								return (
									<LinkWithPreloader href={lang === "ru" ? link?.ru?.url : link?.en?.url} key={`link${index}`} className={styles.li}>
										{lang === "ru" ? link?.ru?.title : link?.en?.title}
									</LinkWithPreloader>
								);
							})}
						{menuSettingsData?.bottom_menu_links &&
							menuSettingsData?.bottom_menu_links.map((linkItem, index) => {
								const link = linkItem.link;
								return (
									<LinkWithPreloader href={lang === "ru" ? link?.ru?.url : link?.en?.url} key={`link${index}`} className={styles.li}>
										{lang === "ru" ? link?.ru?.title : link?.en?.title}
									</LinkWithPreloader>
								);
							})}
						{menuSettingsData?.left_menu_links &&
							menuSettingsData?.left_menu_links.map((linkItem, index) => {
								const link = linkItem.link;
								return (
									<LinkWithPreloader href={lang === "ru" ? link?.ru?.url : link?.en?.url} key={`link${index}`} className={styles.li}>
										{lang === "ru" ? link?.ru?.title : link?.en?.title}
									</LinkWithPreloader>
								);
							})}
					</div>
					<div className={styles.phoneBlock}>
						{(menuSettingsData?.top_menu_phone.phone_ru || menuSettingsData?.top_menu_phone.phone_en) && (
							<div className={styles.phone}>{lang === "ru" ? menuSettingsData?.top_menu_phone.phone_ru : menuSettingsData?.top_menu_phone.phone_en}</div>
						)}
					</div>
				</div>
				<div className="bottom">
					{menuSettingsData?.top_menu_connect_text && (
						<div className={styles.contactUsBlock}>
							<div className={styles.icon}>
								<img className={`${screenLightness === "light" ? styles.active : ""}`} src="/images/contactUsIcon.svg" alt="" width={22} height={22} />
								<img className={`${screenLightness === "dark" ? styles.active : ""}`} src="/images/contactUsIcon_light.svg" alt="" width={22} height={22} />
							</div>
							<div className={styles.text}>{lang === "ru" ? menuSettingsData?.top_menu_connect_text.text_ru : menuSettingsData?.top_menu_connect_text.text_en}</div>
						</div>
					)}
					<div className="popupIcon"></div>
				</div>
			</div>
			<div className={`${styles.stoneIcon} ${activePopup ? styles.active : ""}`} onClick={() => setActivePopup(!activePopup)}>
				<img src={popupData?.popup_open_image?.image1 ? popupData?.popup_open_image?.image1 : "/images/stone.svg"} alt="" />
				<img src={popupData?.popup_open_image?.image2 ? popupData?.popup_open_image?.image2 : "/images/stone_red.svg"} alt="" />
				<div className={styles.linesBlock}>
					<div className={styles.line} />
					<div className={styles.line} />
					<div className={styles.line} />
				</div>
			</div>
			<PopupHud activePopup={activePopup} language={lang} popupData={popupData} />
		</>
	);
}
