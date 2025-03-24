"use client";

import styles from "./styles.module.scss";
import { usePathname } from "next/navigation";
import { useMenuSettingsStore } from "@/store/menuSettingsStore";
import { useEffect, useRef, useState } from "react";
import { useHudMenuStore } from "@/store/hudMenuStore";
import { useInteractiveLinesStore } from "@/store/interactiveLinesStore";
import LinkWithPreloader from "../preloader/LinkWithPreloader";
import Image from "next/image";

export default function MobileHud() {
	const pathname = usePathname(); // Получаем текущий путь
	const { menuSettingsData } = useMenuSettingsStore();
	const { activeMenu, setActiveMenu, screenLightness } = useHudMenuStore();
	const { zIndex, setNewIndex } = useInteractiveLinesStore();
	const [lang, setLang] = useState(pathname.startsWith("/en") ? "en" : "ru"); // Определяем язык

	const savedZIndex = useRef(zIndex);

	/* eslint-disable react-hooks/exhaustive-deps */
	useEffect(() => {
		if (activeMenu) {
			savedZIndex.current = zIndex;
			setNewIndex(1);
		} else {
			setNewIndex(savedZIndex.current);
		}
	}, [activeMenu]);
	/* eslint-enable react-hooks/exhaustive-deps */

	return (
		<>
			<div className={`${styles.mobileHud} ${screenLightness === "light" ? styles.dark : styles.light}`}>
				<LinkWithPreloader href={lang === "ru" ? "/ru" : "/en"} className={styles.logo}>
					<img
						className={`${styles.imgLogo} ${screenLightness === "dark" ? styles.active : ""}`}
						src={menuSettingsData?.top_menu_logo.mobile_logo.logo_light}
						alt="Hubarch logo"
					/>
					<img
						className={`${styles.imgLogo} ${screenLightness === "light" ? styles.active : ""}`}
						src={menuSettingsData?.top_menu_logo.mobile_logo.logo_dark}
						alt="Hubarch logo"
					/>
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
			<div className={`${styles.mobileMenu} ${activeMenu ? styles.active : ""}`}>
				<div className={`screenContent ${styles.menuContent}`}>
					<div className={styles.languageBlock}>
						<LinkWithPreloader
							href={pathname.replace(/^\/en/, "/ru")}
							className={`${styles.lang} ${lang === "ru" ? styles.active : ""}`}
							customClick={() => {
								setLang("ru");
							}}
						>
							Ru
						</LinkWithPreloader>
						<div className={styles.separator}>/</div>
						<LinkWithPreloader
							href={pathname.replace(/^\/ru/, "/en")}
							className={`${styles.lang} ${lang === "en" ? styles.active : ""}`}
							customClick={() => {
								setLang("en");
							}}
						>
							Eng
						</LinkWithPreloader>
					</div>
					<div className={styles.navigationBlock}>
						{menuSettingsData?.top_menu_links.map((linkItem, index) => {
							const link = linkItem.link;
							return (
								<LinkWithPreloader href={lang === "ru" ? link?.ru?.url : link?.en?.url} key={`link${index}`} className={styles.li}>
									{lang === "ru" ? link?.ru?.title : link?.en?.title}
								</LinkWithPreloader>
							);
						})}
						{menuSettingsData?.right_menu_links.map((linkItem, index) => {
							const link = linkItem.link;

							return (
								<LinkWithPreloader href={lang === "ru" ? link?.ru?.url : link?.en?.url} key={`link${index}`} className={styles.li}>
									{lang === "ru" ? link?.ru?.title : link?.en?.title}
								</LinkWithPreloader>
							);
						})}
						{menuSettingsData?.bottom_menu_links.map((linkItem, index) => {
							const link = linkItem.link;
							return (
								<LinkWithPreloader href={lang === "ru" ? link?.ru?.url : link?.en?.url} key={`link${index}`} className={styles.li}>
									{lang === "ru" ? link?.ru?.title : link?.en?.title}
								</LinkWithPreloader>
							);
						})}
						{menuSettingsData?.left_menu_links.map((linkItem, index) => {
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
								<Image className={`${screenLightness === "light" ? styles.active : ""}`} src="/images/contactUsIcon.svg" alt="" width={22} height={22} />
								<Image className={`${screenLightness === "dark" ? styles.active : ""}`} src="/images/contactUsIcon_light.svg" alt="" width={22} height={22} />
							</div>
							<div className={styles.text}>{lang === "ru" ? menuSettingsData?.top_menu_connect_text.text_ru : menuSettingsData?.top_menu_connect_text.text_en}</div>
						</div>
					)}
					<div className="popupIcon"></div>
				</div>
			</div>
		</>
	);
}
