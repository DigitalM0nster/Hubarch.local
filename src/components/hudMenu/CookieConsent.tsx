import { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import { OrderPopupData } from "@/store/allOptionsStore";
import ApplicationComponent from "../applicationComponent/ApplicationComponent";
import { useHudMenuStore } from "@/store/hudMenuStore";

export default function OrderPopup({ language }: { language: string }) {
	const [activePopupItem, setActivePopupItem] = useState(0);

	const { cookieHudActive, setCookieHudActive } = useHudMenuStore();

	useEffect(() => {
		// console.log(popupData);
	}, []);
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
