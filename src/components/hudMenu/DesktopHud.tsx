"use client";

import styles from "./styles.module.scss";
import { usePathname } from "next/navigation";
import { useAllOptionsStore } from "@/store/allOptionsStore";
import { useEffect, useState } from "react";
import { useHudMenuStore } from "@/store/hudMenuStore";
import LinkWithPreloader from "../preloader/LinkWithPreloader";

export default function DesktopHud() {
	const pathname = usePathname(); // Получаем текущий путь
	const { isLoading, menuSettingsData, popupData } = useAllOptionsStore();
	const { screenLightness, activePage, setActivePage, activePopup, setActivePopup } = useHudMenuStore();

	const [lang, setLang] = useState(pathname.startsWith("/en") ? "en" : "ru"); // Определяем язык
	const [localLoading, setLocalLoading] = useState(true);

	// для плавного появления
	useEffect(() => {
		setTimeout(() => {
			setLocalLoading(false);
		}, 500);
	}, []);

	useEffect(() => {
		setActivePage(pathname);
	}, [pathname]);

	useEffect(() => {
		console.log(menuSettingsData);
	}, [isLoading, menuSettingsData]);

	return (
		<div className={`${styles.desktopHud} ${isLoading || localLoading ? styles.inactive : ""} ${screenLightness === "light" ? styles.dark : styles.light}`}>
			<div className={styles.topHud}>
				<div className={styles.leftPart}>
					{/* ЛОГОТИП */}
					<LinkWithPreloader href={lang === "ru" ? "/ru" : "/en"} className={styles.logoBlock}>
						{menuSettingsData?.top_menu_logo.desktop_logo.logo_light ? (
							<img
								className={`${styles.imgLogo} ${screenLightness === "dark" ? styles.active : ""}`}
								src={`${menuSettingsData?.top_menu_logo.desktop_logo.logo_light}`}
								alt="Hubarch logo"
								width={500}
								height={500}
							/>
						) : (
							<img
								className={`${styles.imgLogo} ${screenLightness === "dark" ? styles.active : ""}`}
								src="/images/hubarch_logo_light.svg"
								alt="Hubarch logo"
								width={500}
								height={500}
							/>
						)}
						{menuSettingsData?.top_menu_logo.desktop_logo.logo_dark ? (
							<img
								className={`${styles.imgLogo} ${screenLightness === "light" ? styles.active : ""}`}
								src={`${menuSettingsData?.top_menu_logo.desktop_logo.logo_dark}`}
								alt="Hubarch logo"
								width={500}
								height={500}
							/>
						) : (
							<img
								className={`${styles.imgLogo} ${screenLightness === "light" ? styles.active : ""}`}
								src="/images/hubarch_logo.svg"
								alt="Hubarch logo"
								width={500}
								height={500}
							/>
						)}
					</LinkWithPreloader>
				</div>
				<div className={styles.centerPart}>
					{/* СМЕНА ЯЗЫКА */}
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
					<div className={styles.navigation}>
						{/* ССЫЛКИ НАВИГАЦИИ В ВЕРХНЕМ МЕНЮ */}
						{menuSettingsData?.top_menu_links &&
							menuSettingsData?.top_menu_links?.map((linkItem, index) => {
								const link = linkItem.link;
								return (
									<LinkWithPreloader href={lang === "ru" ? link?.ru?.url : link?.en?.url} key={`link${index}`} className={styles.li}>
										{lang === "ru" ? link?.ru?.title : link?.en?.title}
									</LinkWithPreloader>
								);
							})}
					</div>
					{/* ТЕЛЕФОН В ВЕРХНЕМ МЕНЮ */}
					{(menuSettingsData?.top_menu_phone.phone_ru || menuSettingsData?.top_menu_phone.phone_en) && (
						<div className={styles.phone}>{lang === "ru" ? menuSettingsData?.top_menu_phone.phone_ru : menuSettingsData?.top_menu_phone.phone_en}</div>
					)}
				</div>
				<div className={styles.rightPart}>
					{/* ТЕКСТ СВЯЗАТЬСЯ С НАМИ */}
					{lang === "ru" ? (
						<div className={styles.contactUsBlock}>
							<div className={styles.icon}>
								<img className={`${screenLightness === "light" ? styles.active : ""}`} src="/images/contactUsIcon.svg" alt="" width={22} height={22} />
								<img className={`${screenLightness === "dark" ? styles.active : ""}`} src="/images/contactUsIcon_light.svg" alt="" width={22} height={22} />
								<img className={`${styles.door} ${screenLightness === "light" ? styles.active : ""}`} src="/images/door.svg" alt="" width={22} height={22} />
								<img className={`${styles.door} ${screenLightness === "dark" ? styles.active : ""}`} src="/images/door_light.svg" alt="" width={22} height={22} />
							</div>
							<div className={styles.text}>
								{menuSettingsData?.top_menu_connect_text.text_ru ? menuSettingsData?.top_menu_connect_text.text_ru : "Связаться с нами"}
							</div>
						</div>
					) : (
						<div className={styles.contactUsBlock}>
							<div className={styles.icon}>
								<img className={`${screenLightness === "light" ? styles.active : ""}`} src="/images/contactUsIcon.svg" alt="" width={22} height={22} />
								<img className={`${screenLightness === "dark" ? styles.active : ""}`} src="/images/contactUsIcon_light.svg" alt="" width={22} height={22} />
							</div>
							<div className={styles.text}>{menuSettingsData?.top_menu_connect_text.text_en ? menuSettingsData?.top_menu_connect_text.text_en : "Contact us"}</div>
						</div>
					)}
				</div>
			</div>
			<div className={`${styles.rightHud} ${activePage === "/en/projects" || activePage === "/ru/projects" ? styles.hidden : ""}`}>
				{menuSettingsData?.right_menu_links &&
					menuSettingsData?.right_menu_links?.map((linkItem, index) => {
						const link = linkItem.link;
						return (
							<LinkWithPreloader href={lang === "ru" ? link?.ru?.url : link?.en?.url} key={`link${index}`} className={styles.li}>
								{lang === "ru" ? link?.ru?.title : link?.en?.title}
							</LinkWithPreloader>
						);
					})}
			</div>
			<div className={styles.bottomHud}>
				<div className={styles.leftPart}>
					{menuSettingsData?.bottom_menu_links &&
						menuSettingsData?.bottom_menu_links?.map((linkItem, index) => {
							const link = linkItem.link;
							return (
								<LinkWithPreloader href={lang === "ru" ? link?.ru?.url : link?.en?.url} key={`link${index}`} className={styles.li}>
									{lang === "ru" ? link?.ru?.title : link?.en?.title}
								</LinkWithPreloader>
							);
						})}
				</div>
				<div className={styles.rightPart}>
					<div className={`${styles.stoneIcon} ${activePopup ? styles.active : ""}`} onClick={() => setActivePopup(!activePopup)}>
						<img src={popupData?.popup_open_image?.image1 ? popupData?.popup_open_image?.image1 : "/images/stone.svg"} alt="" />
						<img src={popupData?.popup_open_image?.image2 ? popupData?.popup_open_image?.image2 : "/images/stone_red.svg"} alt="" />
						<div className={styles.linesBlock}>
							<div className={styles.line} />
							<div className={styles.line} />
							<div className={styles.line} />
						</div>
					</div>
				</div>
			</div>
			<div className={styles.leftHud}>
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
		</div>
	);
}
