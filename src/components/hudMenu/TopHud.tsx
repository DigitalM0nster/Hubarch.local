"use client";

import { useEffect } from "react";
import Link from "next/link";
import styles from "./styles.module.scss";
import useMenuSettingsStore from "@/store/menuSettingsStore";
import { usePathname } from "next/navigation";

export default function TopHud() {
	const pathname = usePathname(); // Получаем текущий путь
	const lang = pathname.startsWith("/en") ? "en" : "ru"; // Определяем язык

	// Используем zustand store
	const { menuSettingsData, fetchMenuSettings } = useMenuSettingsStore();

	useEffect(() => {
		fetchMenuSettings(); // Вызываем API-запрос
	}, []);

	return (
		<>
			<div className={styles.topHud}>
				<div className={styles.leftPart}>
					<Link href="/" className={styles.logoBlock}>
						<img src="/images/hubarch_logo.svg" alt="Hubarch" />
					</Link>
					<div className={styles.languageBlock}>
						<Link href="/ru" className={`${styles.lang} ${lang === "ru" ? styles.active : ""}`}>
							Ru
						</Link>
						<div className={styles.separator}>/</div>
						<Link href="/en" className={`${styles.lang} ${lang === "en" ? styles.active : ""}`}>
							Eng
						</Link>
					</div>
				</div>
				<div className={styles.centerPart}>
					<div className={styles.navigation}>
						<Link href={`/${lang}/services`} className={styles.li}>
							Услуги
						</Link>
						<Link href={`/${lang}/contacts`} className={styles.li}>
							Контакты
						</Link>
					</div>
				</div>
				<div className={styles.rightPart}>
					<div className={styles.number}>{menuSettingsData?.top_menu_phone || "Загрузка..."}</div>
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
