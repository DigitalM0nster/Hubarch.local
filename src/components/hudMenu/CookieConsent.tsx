import styles from "./styles.module.scss";
import { useHudMenuStore } from "@/store/hudMenuStore";
import { useAllOptionsStore } from "@/store/allOptionsStore";
import parse from "html-react-parser";

export default function OrderPopup({ language }: { language: string }) {
	const { cookieHudActive, setCookieHudActive, activePage } = useHudMenuStore();
	const { cookieHudData } = useAllOptionsStore();

	// Дефолтный текст про куки
	const defaultCookieText =
		language === "ru"
			? "Мы используем cookie-файлы для улучшения работы сайта, анализа трафика и персонализации контента. Продолжая использовать сайт, вы соглашаетесь с использованием cookie-файлов."
			: "We use cookies to improve website performance, analyze traffic and personalize content. By continuing to use the site, you agree to the use of cookies.";

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
							cookieHudData?.ru.button.button_link ? (
								<a href={cookieHudData?.ru.button.button_link} target="_blank" className={styles.button}>
									{cookieHudData?.ru.button.button_text || "ОК"}
								</a>
							) : (
								<div className={styles.button} onClick={() => setCookieHudActive(false)}>
									{cookieHudData?.ru.button.button_text || "ОК"}
								</div>
							)
						) : cookieHudData?.en.button.button_link ? (
							<a href={cookieHudData?.en.button.button_link} target="_blank" className={styles.button}>
								{cookieHudData?.en.button.button_text || "OK"}
							</a>
						) : (
							<div className={styles.button} onClick={() => setCookieHudActive(false)}>
								{cookieHudData?.en.button.button_text || "OK"}
							</div>
						)}
						<div className={styles.button} onClick={() => setCookieHudActive(false)}>
							{language === "ru" ? "Принять" : "Accept"}
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
