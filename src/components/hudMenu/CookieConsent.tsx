import styles from "./styles.module.scss";
import { useHudMenuStore } from "@/store/hudMenuStore";

export default function OrderPopup({ language }: { language: string }) {
	const { cookieHudActive, setCookieHudActive } = useHudMenuStore();

	return (
		<>
			<div className={`${styles.cookieHud} ${cookieHudActive ? styles.active + " active" : ""}`}>
				<div className={styles.title}>Мы используем cookie-файлы</div>
				<div className={styles.content}>
					<div className={styles.text}>
						Наш сайт использует только необходимые cookie-файлы для корректной работы. Мы не собираем данные для аналитики или маркетинга.
					</div>
					<div className={styles.button} onClick={() => setCookieHudActive(false)}>
						Принять
					</div>
				</div>
			</div>
		</>
	);
}
