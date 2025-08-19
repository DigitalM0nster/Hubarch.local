import { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import { PopupData } from "@/store/allOptionsStore";

export default function PopupHud({ activePopup, popupData, language }: { activePopup: boolean; popupData: PopupData | null; language: string }) {
	const [activePopupItem, setActivePopupItem] = useState(0);
	// Состояние для отслеживания активного инпута (фокус)
	const [activeInputIndex, setActiveInputIndex] = useState<number | null>(null);

	// Состояние для формы
	const [formData, setFormData] = useState({
		name: "",
		phone: "",
		email: "",
	});
	const [formStatus, setFormStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

	useEffect(() => {
		// console.log(popupData);
	}, [popupData]);

	// Функция для создания цвета с прозрачностью
	const getColorWithOpacity = (color: string | undefined, opacity: number) => {
		// Если цвет не определен, возвращаем черный с прозрачностью
		if (!color) {
			return `rgba(0, 0, 0, ${opacity})`;
		}

		// Если цвет уже в формате hex, конвертируем его в rgba
		if (color.startsWith("#")) {
			// Убираем # и разбиваем на компоненты
			const hex = color.slice(1);
			const r = parseInt(hex.slice(0, 2), 16);
			const g = parseInt(hex.slice(2, 4), 16);
			const b = parseInt(hex.slice(4, 6), 16);
			return `rgba(${r}, ${g}, ${b}, ${opacity})`;
		}
		// Если цвет уже в формате rgba, просто меняем прозрачность
		if (color.startsWith("rgba")) {
			return color.replace(/[\d.]+\)$/, `${opacity})`);
		}
		// Если цвет в формате rgb, добавляем прозрачность
		if (color.startsWith("rgb(")) {
			return color.replace("rgb(", "rgba(").replace(")", `, ${opacity})`);
		}
		// По умолчанию возвращаем исходный цвет
		return color;
	};

	// Обработчик фокуса на инпуте
	const handleInputFocus = (inputIndex: number) => {
		setActiveInputIndex(inputIndex);
	};

	// Обработчик потери фокуса инпута
	const handleInputBlur = () => {
		setActiveInputIndex(null);
	};

	// Функция отправки формы
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!formData.name || !formData.phone || !formData.email) {
			setFormStatus("error");
			return;
		}

		setFormStatus("sending");

		try {
			// Получаем данные текущего попапа
			const currentPopup = popupData?.popup_items?.[activePopupItem];
			const popupTitle = currentPopup?.title ? (language === "ru" ? currentPopup.title.ru : currentPopup.title.en) : "";
			const popupButtonText = currentPopup?.button_text ? (language === "ru" ? currentPopup.button_text.ru : currentPopup.button_text.en) : "";

			await fetch("/api/submit-form", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					name: formData.name,
					phone: formData.phone,
					email: formData.email,
					formType: "popup", // Указываем что это попап форма
					popupTitle: popupTitle, // Заголовок попапа
					popupButtonText: popupButtonText, // Текст кнопки
				}),
			});

			setFormStatus("success");
			// Сбрасываем форму
			setFormData({
				name: "",
				phone: "",
				email: "",
			});

			// Через 2 секунды сбрасываем статус
			setTimeout(() => {
				setFormStatus("idle");
			}, 2000);
		} catch (e) {
			setFormStatus("error");
		}
	};

	return (
		<>
			<div className={`${styles.popupHud} ${activePopup ? styles.active : ""}`}>
				<div className={styles.popupContent}>
					{popupData?.popup_items?.map((item, index) => {
						return (
							<div
								className={`${styles.popupItem} ${activePopupItem === index ? styles.active : ""}`}
								key={`popupItem_${index}`}
								style={
									{
										backgroundColor: item.background_color,
										color: item.text_color,
										"--textColor": item.text_color,
									} as React.CSSProperties
								}
							>
								{item.title && (
									<div className={styles.title} style={{ color: item.text_color }}>
										{language === "ru" ? item.title.ru : item.title.en}
									</div>
								)}
								{item.image != false && (
									<div className={styles.image}>
										<img src={item.image} alt={item.title.ru} />
									</div>
								)}
								<form
									className={styles.form}
									onSubmit={handleSubmit}
									style={{
										color: item.text_color,
										borderLeft: `1px solid ${getColorWithOpacity(item.text_color, 0.2)}`,
										borderRight: `1px solid ${getColorWithOpacity(item.text_color, 0.2)}`,
									}}
								>
									<div className={styles.formInput}>
										<input
											type="text"
											placeholder={language === "ru" ? "Имя" : "Name"}
											value={formData.name}
											onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
											style={{
												color: item.text_color,
												borderBottom: `1px solid ${getColorWithOpacity(item.text_color, activeInputIndex === 0 ? 1 : 0.2)}`,
											}}
											onFocus={() => handleInputFocus(0)}
											onBlur={handleInputBlur}
										/>
									</div>
									<div className={styles.formInput}>
										<input
											type="text"
											placeholder={language === "ru" ? "Телефон" : "Phone"}
											value={formData.phone}
											onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
											style={{
												color: item.text_color,
												borderBottom: `1px solid ${getColorWithOpacity(item.text_color, activeInputIndex === 1 ? 1 : 0.2)}`,
											}}
											onFocus={() => handleInputFocus(1)}
											onBlur={handleInputBlur}
										/>
									</div>
									<div className={styles.formInput}>
										<input
											type="text"
											placeholder="Email"
											value={formData.email}
											onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
											style={{
												color: item.text_color,
												borderBottom: `1px solid ${getColorWithOpacity(item.text_color, activeInputIndex === 2 ? 1 : 0.2)}`,
											}}
											onFocus={() => handleInputFocus(2)}
											onBlur={handleInputBlur}
										/>
									</div>
									<button type="submit" disabled={formStatus === "sending"}>
										<div className={styles.icon}>
											<svg width="22" height="21" viewBox="0 0 22 21" fill="none" xmlns="http://www.w3.org/2000/svg">
												<path
													fillRule="evenodd"
													clipRule="evenodd"
													d="M4.74669 16.7533C8.2003 20.2069 13.7997 20.2069 17.2533 16.7533C20.7069 13.2997 20.7069 7.7003 17.2533 4.24669C13.7997 0.793087 8.2003 0.793087 4.74669 4.24669C1.29309 7.7003 1.29309 13.2997 4.74669 16.7533ZM3.57538 17.9246C7.67588 22.0251 14.3241 22.0251 18.4246 17.9246C22.5251 13.8241 22.5251 7.17588 18.4246 3.07538C14.3241 -1.02513 7.67588 -1.02513 3.57538 3.07538C-0.525126 7.17588 -0.525126 13.8241 3.57538 17.9246Z"
													fill={item.text_color}
												/>
												<path d="M10.5097 4.9841L16.1774 10.6517L15.0061 11.8231L9.3384 6.15541L10.5097 4.9841Z" fill={item.text_color} />
												<path d="M16.1772 10.6516L10.5096 16.3193L9.33828 15.148L15.0059 9.48031L16.1772 10.6516Z" fill={item.text_color} />
												<path d="M14.9709 11.3277H1.42474V9.6712H14.9709V11.3277Z" fill={item.text_color} />
											</svg>
										</div>
										<div className={styles.text} style={{ color: item.text_color }}>
											{formStatus === "sending"
												? language === "ru"
													? "Отправка..."
													: "Sending..."
												: formStatus === "success"
												? language === "ru"
													? "Отправлено!"
													: "Sent!"
												: language === "ru"
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
