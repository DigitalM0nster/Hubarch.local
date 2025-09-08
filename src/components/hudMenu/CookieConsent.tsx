import styles from "./styles.module.scss";
import { useHudMenuStore } from "@/store/hudMenuStore";
import { useAllOptionsStore } from "@/store/allOptionsStore";
import parse from "html-react-parser";
import { useCallback, useEffect } from "react";

export default function OrderPopup({ language }: { language: string }) {
	const { cookieHudActive, setCookieHudActive, activePage } = useHudMenuStore();
	const { cookieHudData } = useAllOptionsStore();
	// Дефолтный текст про куки
	const defaultCookieText =
		language === "ru"
			? "Мы используем cookie-файлы для улучшения работы сайта, анализа трафика и персонализации контента. Продолжая использовать сайт, вы соглашаетесь с использованием cookie-файлов."
			: "We use cookies to improve website performance, analyze traffic and personalize content. By continuing to use the site, you agree to the use of cookies.";

	// Хелпер: получить значение cookie по имени
	const getCookie = useCallback((name: string) => {
		if (typeof document === "undefined") return "";
		const match = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([.$?*|{}()\[\]\\\/\+^])/g, "\\$1") + "=([^;]*)"));
		return match ? decodeURIComponent(match[1]) : "";
	}, []);

	// Обработчик принятия: сохраняем согласие и скрываем баннер
	const acceptCookies = useCallback(() => {
		try {
			const oneYearMs = 365 * 24 * 60 * 60 * 1000;
			const expires = new Date(Date.now() + oneYearMs).toUTCString();
			// Сохраняем в cookie на 1 год
			document.cookie = `cookieConsent=accepted; expires=${expires}; path=/; SameSite=Lax`;
			// Дублируем в localStorage на всякий случай
			localStorage.setItem("cookieConsent", "accepted");
		} catch (e) {
			// Игнорируем возможные ошибки доступа к storage
		}
		setCookieHudActive(false);
	}, [setCookieHudActive]);

	// При монтировании: если ранее уже принято — сразу скрываем баннер
	useEffect(() => {
		if (typeof window === "undefined") return;
		const lsAccepted = (() => {
			try {
				return localStorage.getItem("cookieConsent") === "accepted";
			} catch {
				return false;
			}
		})();
		const cookieAccepted = getCookie("cookieConsent") === "accepted";
		if (lsAccepted || cookieAccepted) {
			setCookieHudActive(false);
		}
	}, [getCookie, setCookieHudActive]);

	return (
		<>
			<div
				className={`${styles.cookieHud} ${cookieHudActive ? styles.active + " active" : ""} ${
					activePage === "/ru/media" || activePage === "/en/media" ? styles.mediaPageActive : ""
				}`}
			>
				<div className={styles.title}>{language === "ru" ? "мы используем cookie-файлы" : "We use cookies"}</div>
				<div className={styles.content}>
					<div className={styles.text}>
						{language === "ru" ? parse(cookieHudData?.ru?.text || defaultCookieText) : parse(cookieHudData?.en?.text || defaultCookieText)}
					</div>
					<div className={styles.buttonsBlock}>
						{language === "ru" ? (
							cookieHudData?.ru.button.button_link.url ? (
								<a href={cookieHudData?.ru.button.button_link.url} target={cookieHudData?.ru.button.button_link.target} className={styles.button}>
									{cookieHudData?.ru.button.button_text || "ОК"}
								</a>
							) : (
								<div className={styles.button} onClick={acceptCookies}>
									{cookieHudData?.ru.button.button_text || "ОК"}
								</div>
							)
						) : cookieHudData?.en.button.button_link.url ? (
							<a href={cookieHudData?.en.button.button_link.url} target={cookieHudData?.en.button.button_link.target} className={styles.button}>
								{cookieHudData?.en.button.button_text || "OK"}
							</a>
						) : (
							<div className={styles.button} onClick={acceptCookies}>
								{cookieHudData?.en.button.button_text || "OK"}
							</div>
						)}
						<div className={styles.button} onClick={acceptCookies}>
							{language === "ru" ? "Принять" : "Accept"}
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
