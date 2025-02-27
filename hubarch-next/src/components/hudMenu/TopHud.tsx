"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./styles.module.scss";
import useMainSettingsStore from "@/store/mainSettingsStore";

export default function TopHud() {
	const [language, setLanguage] = useState<string>("ru");

	// Используем zustand store
	const { mainSettingsData, fetchMainSettings } = useMainSettingsStore();

	useEffect(() => {
		fetchMainSettings(); // Вызываем API-запрос
	}, []);

	return (
		<>
			<div className={styles.topHud}>
				<div className={styles.leftPart}>
					<Link href="/" className={styles.logoBlock}>
						<img src="/images/hubarch_logo.svg" alt="Hubarch" />
					</Link>
					<div className={styles.languageBlock}>
						<div className={`${styles.lang} ${language === "ru" ? styles.active : ""}`} onClick={() => setLanguage("ru")}>
							Ru
						</div>
						<div className={styles.separator}>/</div>
						<div className={`${styles.lang} ${language === "en" ? styles.active : ""}`} onClick={() => setLanguage("en")}>
							Eng
						</div>
					</div>
				</div>
				<div className={styles.centerPart}>
					<div className={styles.navigation}>
						<Link href="/services" className={styles.li}>
							Услуги
						</Link>
						<Link href="/contacts" className={styles.li}>
							Контакты
						</Link>
					</div>
				</div>
				<div className={styles.rightPart}>
					<div className={styles.number}>{mainSettingsData?.top_menu_phone || "Загрузка..."}</div>
					<div className={styles.contactUsBlock}>
						<div className={styles.icon}>
							<img src="/images/contactUsIcon.svg" />
						</div>
						<div className={styles.text}>Связаться с нами</div>
					</div>
				</div>
			</div>
		</>
	);
}
