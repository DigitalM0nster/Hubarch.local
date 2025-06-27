import { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import { PopupData } from "@/store/allOptionsStore";

export default function PopupHud({ activePopup, popupData, language }: { activePopup: boolean; popupData: PopupData | null; language: string }) {
	const [activePopupItem, setActivePopupItem] = useState(0);

	useEffect(() => {
		// console.log(popupData);
	}, [popupData]);
	return (
		<>
			<div className={`${styles.popupHud} ${activePopup ? styles.active : ""}`}>
				<div className={styles.popupContent}>
					{popupData?.popup_items?.map((item, index) => {
						return (
							<div className={`${styles.popupItem} ${activePopupItem === index ? styles.active : ""}`} key={`popupItem_${index}`}>
								{item.title && <div className={styles.title}>{language === "ru" ? item.title.ru : item.title.en}</div>}
								{item.image != false && (
									<div className={styles.image}>
										<img src={item.image} alt={item.title.ru} />
									</div>
								)}
								<form className={styles.form}>
									<div className={styles.formInput}>
										<input type="text" placeholder={language === "ru" ? "Имя" : "Name"} />
									</div>
									<div className={styles.formInput}>
										<input type="text" placeholder={language === "ru" ? "Телефон" : "Phone"} />
									</div>
									<div className={styles.formInput}>
										<input type="text" placeholder="Email" />
									</div>
									<button>
										<div className={styles.icon} />
										<div className={styles.text}>
											{language === "ru"
												? item.button_text.ru
													? item.button_text.ru
													: "Отправить заявку"
												: item.button_text.en
												? item.button_text.en
												: "Send request"}
										</div>
									</button>
								</form>
							</div>
						);
					})}
					{popupData?.popup_items?.length && popupData?.popup_items?.length > 1 && (
						<div className={styles.navigation}>
							<div
								className={`${styles.arrow} ${styles.prev} ${activePopupItem === 0 ? styles.disabled : ""}`}
								onClick={() => setActivePopupItem(Math.max(activePopupItem - 1, 0))}
							/>
							<div className={styles.dots}>
								{popupData?.popup_items?.map((item, index) => {
									return (
										<div
											key={`dot_${index}`}
											className={`${styles.dot} ${activePopupItem === index ? styles.active : ""}`}
											onClick={() => setActivePopupItem(index)}
										/>
									);
								})}
							</div>
							<div
								className={`${styles.arrow} ${styles.next} ${activePopupItem === popupData?.popup_items?.length - 1 ? styles.disabled : ""}`}
								onClick={() => setActivePopupItem(Math.min(activePopupItem + 1, popupData?.popup_items?.length - 1))}
							/>
						</div>
					)}
				</div>
			</div>
		</>
	);
}
