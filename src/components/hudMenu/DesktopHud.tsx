"use client";

import styles from "./styles.module.scss";
import { usePathname } from "next/navigation";
import { useMenuSettingsStore } from "@/store/menuSettingsStore";
import { useEffect, useState } from "react";
import { useHudMenuStore } from "@/store/hudMenuStore";
import LinkWithPreloader from "../preloader/LinkWithPreloader";
import Image from "next/image";

export default function DesktopHud() {
	const pathname = usePathname(); // Получаем текущий путь
	const { isLoading, menuSettingsData } = useMenuSettingsStore();
	const { screenLightness } = useHudMenuStore();

	const [lang, setLang] = useState(pathname.startsWith("/en") ? "en" : "ru"); // Определяем язык
	const [localLoading, setLocalLoading] = useState(true);

	// для плавного появления
	useEffect(() => {
		setTimeout(() => {
			setLocalLoading(false);
		}, 500);
	}, []);

	return (
		<div className={`${styles.desktopHud} ${isLoading || localLoading ? styles.inactive : ""} ${screenLightness === "light" ? styles.dark : styles.light}`}>
			<div className={styles.topHud}>
				<div className={styles.leftPart}>
					{/* ЛОГОТИП */}
					<LinkWithPreloader href={lang === "ru" ? "/ru" : "/en"} className={styles.logoBlock}>
						<img
							className={`${styles.imgLogo} ${screenLightness === "dark" ? styles.active : ""}`}
							src={`${menuSettingsData?.top_menu_logo.desktop_logo.logo_light}`}
							alt="Hubarch logo"
							width={500}
							height={500}
						/>
						<img
							className={`${styles.imgLogo} ${screenLightness === "light" ? styles.active : ""}`}
							src={`${menuSettingsData?.top_menu_logo.desktop_logo.logo_dark}`}
							alt="Hubarch logo"
							width={500}
							height={500}
						/>
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
						{menuSettingsData?.top_menu_links.map((linkItem, index) => {
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
					{menuSettingsData?.top_menu_connect_text && (
						<div className={styles.contactUsBlock}>
							<div className={styles.icon}>
								<Image className={`${screenLightness === "light" ? styles.active : ""}`} src="/images/contactUsIcon.svg" alt="" width={22} height={22} />
								<Image className={`${screenLightness === "dark" ? styles.active : ""}`} src="/images/contactUsIcon_light.svg" alt="" width={22} height={22} />
							</div>
							<div className={styles.text}>{lang === "ru" ? menuSettingsData?.top_menu_connect_text.text_ru : menuSettingsData?.top_menu_connect_text.text_en}</div>
						</div>
					)}
				</div>
			</div>
			<div className={styles.rightHud}>
				{menuSettingsData?.right_menu_links.map((linkItem, index) => {
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
					{menuSettingsData?.bottom_menu_links.map((linkItem, index) => {
						const link = linkItem.link;
						return (
							<LinkWithPreloader href={lang === "ru" ? link?.ru?.url : link?.en?.url} key={`link${index}`} className={styles.li}>
								{lang === "ru" ? link?.ru?.title : link?.en?.title}
							</LinkWithPreloader>
						);
					})}
				</div>
				<div className={styles.rightPart}>
					<div className={styles.stoneIcon}>
						<img src={menuSettingsData?.bottom_right_image} alt="" />
					</div>
				</div>
			</div>
			<div className={styles.leftHud}>
				{menuSettingsData?.left_menu_links.map((linkItem, index) => {
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
