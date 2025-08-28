import styles from "./styles.module.scss";
import { useEffect, useRef, useState } from "react";
import { useWindowStore } from "@/store/windowStore";
import { useAreaRangeStore } from "@/store/areaRangeStore";
import { useInteractiveLinesStore } from "@/store/interactiveLinesStore";
import { useAllOptionsStore } from "@/store/allOptionsStore";
import parse from "html-react-parser";
import { useHudMenuStore } from "@/store/hudMenuStore";

export default function ApplicationComponent({ language, data, isPopup, text_is_light = false }: { language: string; data: any; isPopup?: boolean; text_is_light?: boolean }) {
	const { isMobile } = useWindowStore();
	const { ranges, fetchRanges } = useAreaRangeStore();
	// console.log(ranges);
	const { setActiveOrderPopup, activeOrderPopup, isTopBannerActive } = useHudMenuStore();
	const formRef = useRef<HTMLDivElement>(null);
	const dropdownRef = useRef<HTMLDivElement>(null);

	const { horizontalLine, miniLine } = useInteractiveLinesStore();

	const [name, setName] = useState("");
	const [phone, setPhone] = useState("");
	const [email, setEmail] = useState("");
	const [message, setMessage] = useState("");
	const [selectedRange, setSelectedRange] = useState<string | null>(null);
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const [status, setStatus] = useState<"idle" | "success" | "error" | "sending">("idle");

	// Ошибки валидации для полей формы
	const [errors, setErrors] = useState<{
		name?: string;
		phone?: string;
		email?: string;
		selectedRange?: string;
		message?: string;
	}>({});

	// Разрешаем только цифры, пробел, + - ( )
	const sanitizePhoneInput = (value: string) => value.replace(/[^0-9+\-() ]/g, "");

	// Телефон валиден, если набрано минимум 7 цифр
	const isValidPhone = (value: string) => {
		const digitsOnly = value.replace(/\D/g, "");
		return digitsOnly.length >= 7;
	};

	// Простой валидатор email
	const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

	const calculateInteractiveLines = (e: React.MouseEvent<HTMLElement>, degrees: number) => {
		const form = formRef.current;
		if (!form) return;
		if (isMobile) return;

		const formRect = form.getBoundingClientRect();
		const elementRect = e.currentTarget.getBoundingClientRect();

		const offsetY = elementRect.top + elementRect.height - formRect.top; // расстояние от верха формы
		const percent = (offsetY / formRect.height) * 100; // процент от высоты формы

		horizontalLine.setNewY(percent); // сохраняем процент
		miniLine.setNewRotation(degrees); // сохраняем процент
	};

	const handleSubmit = async () => {
		console.log("handleSubmit вызван");
		console.log("Текущие значения:", { name, phone, email, selectedRange, message });

		const newErrors: {
			name?: string;
			phone?: string;
			email?: string;
			selectedRange?: string;
			message?: string;
		} = {};

		// Требуем минимум одно из полей: телефон или email
		if (!phone && !email) {
			console.log("Ошибка: не заполнен ни телефон, ни email");
			const msg = language === "ru" ? "Укажите телефон или email" : "Provide phone or email";
			newErrors.phone = msg;
			newErrors.email = msg;
		}

		// Разрешаем только одно поле контакта: телефон ИЛИ email
		if (phone && email) {
			console.log("Ошибка: заполнены оба поля контакта");
			const msg = language === "ru" ? "Заполните только один контакт: телефон или email" : "Fill only one: phone or email";
			newErrors.phone = msg;
			newErrors.email = msg;
		}

		// Если телефон заполнен — проверяем формат
		if (phone && !isValidPhone(phone)) {
			console.log("Ошибка: неправильный формат телефона");
			newErrors.phone = language === "ru" ? "Некорректный номер телефона" : "Invalid phone number";
		}

		// Если email заполнен — проверяем формат
		if (email && !isValidEmail(email)) {
			console.log("Ошибка: неправильный формат email");
			newErrors.email = language === "ru" ? "Некорректный email" : "Invalid email";
		}

		// Если есть ошибки по контактам — показываем и выходим
		if (Object.keys(newErrors).length > 0) {
			console.log("Есть ошибки контактов:", newErrors);
			setErrors(newErrors);
			setStatus("error");
			return;
		}

		// Базовые обязательные поля
		setStatus("sending");

		try {
			// Тут ты можешь отправить данные куда нужно, например:
			await fetch("/api/submit-form", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					name,
					phone,
					email,
					footage: selectedRange,
					message,
					formType: "application", // Указываем тип формы
				}),
			});

			setStatus("success");
			// сбросить форму
			setName("");
			setPhone("");
			setEmail("");
			setSelectedRange(null);
			setMessage("");
			setErrors({});
		} catch (e) {
			setStatus("error");
		}
	};

	// КЛИК ЧТОБЫ УБИРАТЬ ДРОПДАУН
	useEffect(() => {
		fetchRanges();

		const handleClickOutside = (event: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setDropdownOpen(false);
			}
		};

		document.addEventListener("click", handleClickOutside);

		return () => {
			document.removeEventListener("click", handleClickOutside);
		};
	}, []);

	return (
		<>
			<div
				className={`${isPopup ? `orderPopup ${styles.orderPopup}` : "screen"} ${styles.applicationScreen} applicationScreen ${
					isPopup && activeOrderPopup ? styles.active : ""
				} ${isTopBannerActive ? styles.withTopBanner + " withTopBanner" : ""}`}
				data-screen-lightness={text_is_light ? "dark" : "light"}
				data-lines-index={isMobile ? 0 : 1}
				data-mini-line-rotation={-45}
				data-position-x={isMobile ? 50 : 50}
				data-position-y={50}
				data-horizontal-x={isMobile ? 50 : 50}
				data-horizontal-width={isMobile ? 100 : 100}
				data-vertical-height={isMobile ? 100 : 100}
				data-lines-color={text_is_light ? "light" : "dark"}
				data-left-line-x={0}
				data-left-line-height={0}
				data-right-line-x={100}
				data-right-line-height={0}
			>
				<div className={`screenContent ${styles.screenContent}`}>
					<div className={`${styles.titleBackgroundBlock} titleBackgroundBlock ${data?.image ? styles.transparent : ""} ${data?.image ? "transparent" : ""}`}>
						<div className={`titleBackground ${styles.titleBackground}`}>{data?.title_background || (language === "ru" ? "СВЯЖИТЕСЬ С НАМИ" : "CONTACT US")}</div>
					</div>
					<div ref={formRef} className={`${styles.form} form`}>
						<div className={styles.topPart}>
							<input
								type="text"
								onMouseEnter={(e) => {
									calculateInteractiveLines(e, 45);
								}}
								placeholder={language === "ru" ? "Имя" : "Name"}
								value={name}
								onChange={(e) => {
									setName(e.target.value);
									setErrors((prev) => ({ ...prev, name: undefined }));
								}}
							/>

							<input
								type="tel"
								onMouseEnter={(e) => {
									calculateInteractiveLines(e, 45);
								}}
								placeholder={errors.phone ? errors.phone : language === "ru" ? "Телефон" : "Phone"}
								value={phone}
								onChange={(e) => {
									const sanitized = sanitizePhoneInput(e.target.value);
									setPhone(sanitized);
									setErrors((prev) => ({ ...prev, phone: undefined }));
								}}
								className={errors.phone ? styles.error : ""}
							/>
							<input
								type="email"
								onMouseEnter={(e) => {
									calculateInteractiveLines(e, 45);
								}}
								placeholder={errors.email ? errors.email : language === "ru" ? "Email" : "Email"}
								value={email}
								onChange={(e) => {
									setEmail(e.target.value);
									setErrors((prev) => ({ ...prev, email: undefined }));
								}}
								className={errors.email ? styles.error : ""}
							/>
							{errors.email ? (
								<div className={styles.error} aria-live="polite">
									{/* Показываем ошибку email только если это ошибка формата, а не общая ошибка контактов */}
									{email && !isValidEmail(email) ? errors.email : null}
								</div>
							) : null}
						</div>
						<div className={`${styles.bottomPart}`}>
							<div className={styles.formInputs}>
								<div
									ref={dropdownRef}
									className={`${styles.dropdown} ${dropdownOpen ? styles.active : ""}`}
									onMouseEnter={(e) => {
										calculateInteractiveLines(e, 45);
									}}
								>
									<div className={styles.dropdownSelected} onClick={() => setDropdownOpen((prev) => !prev)}>
										{selectedRange || (language === "ru" ? "Метраж" : "Footage")}
									</div>
									<div className={styles.dropdownList}>
										{ranges.length > 0 ? (
											<>
												<div
													className={`${styles.dropdownItem} ${selectedRange === "Метраж" || selectedRange === "Footage" ? styles.active : ""}`}
													onClick={() => {
														language === "ru" ? setSelectedRange("Метраж") : setSelectedRange("Footage");
														setDropdownOpen(false);
														setErrors((prev) => ({ ...prev, selectedRange: undefined }));
													}}
												>
													{language === "ru" ? "Выберите метраж" : "Select footage"}
												</div>
												{ranges.map((range, index) => (
													<div
														key={index}
														className={`${styles.dropdownItem} ${selectedRange === range.label ? styles.active : ""}`}
														onClick={() => {
															setSelectedRange(range.label);
															setDropdownOpen(false);
															setErrors((prev) => ({ ...prev, selectedRange: undefined }));
														}}
													>
														{range.label}
													</div>
												))}
											</>
										) : (
											<></>
										)}
									</div>
								</div>
								<div
									className="noScreenScrollZone"
									onMouseEnter={(e) => {
										calculateInteractiveLines(e, 45);
									}}
								>
									<textarea
										className="scrollable"
										placeholder={language === "ru" ? "Сообщение" : "Message"}
										value={message}
										onChange={(e) => {
											setMessage(e.target.value);
											setErrors((prev) => ({ ...prev, message: undefined }));
										}}
									/>
								</div>
								<div className={styles.buttonBlock}>
									<div className={styles.button} onClick={handleSubmit}>
										<div className={styles.icon}>
											<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
												<path
													fillRule="evenodd"
													clipRule="evenodd"
													d="M2.42668 9.57332C4.40017 11.5468 7.59983 11.5468 9.57332 9.57332C11.5468 7.59983 11.5468 4.40017 9.57332 2.42668C7.59983 0.453192 4.40017 0.453192 2.42668 2.42668C0.453193 4.40017 0.453193 7.59983 2.42668 9.57332ZM1.75736 10.2426C4.10051 12.5858 7.89949 12.5858 10.2426 10.2426C12.5858 7.89949 12.5858 4.10051 10.2426 1.75736C7.89949 -0.585786 4.10051 -0.585786 1.75736 1.75736C-0.585786 4.10051 -0.585786 7.89949 1.75736 10.2426Z"
													fill="var(--mainTextColor)"
												/>
												<path d="M5.71984 2.84806L8.9585 6.08671L8.28917 6.75604L5.05052 3.51738L5.71984 2.84806Z" fill="var(--mainTextColor)" />
												<path d="M8.95843 6.08664L5.71977 9.3253L5.05045 8.65598L8.28911 5.41732L8.95843 6.08664Z" fill="var(--mainTextColor)" />
												<path d="M8.2691 6.47297H0.528424V5.5264H8.2691V6.47297Z" fill="var(--mainTextColor)" />
											</svg>
										</div>
										<div className={styles.text}>
											{status === "sending"
												? language === "ru"
													? "Отправка..."
													: "sending"
												: status === "success"
												? language === "ru"
													? "Отправлено!"
													: "Done!"
												: language === "ru"
												? "Отправить"
												: "Send"}
										</div>
									</div>

									<div className={styles.acceptText}>
										{parse(isPopup ? (language === "ru" ? data?.accept_text?.ru || `` : data?.accept_text?.en || ``) : data?.accept_text || ``)}
									</div>
								</div>
							</div>
						</div>
						<div className={`${styles.textBlock} textBlock`}>
							{parse(
								isPopup
									? language === "ru"
										? data?.text?.ru || ``
										: data?.text?.en || ``
									: data?.additional_text ||
											(language === "ru"
												? `<p><span style='font-family: "Panama Regular", sans-serif;'>СВЯЖИТЕСЬ С&nbsp;НАМИ</span>, будем рады обсудить ваш проект и ответить на вопросы.</p>`
												: `<p><span style='font-family: "Panama Regular", sans-serif;'>CONTACT US</span>, we would be happy to discuss your project and answer any questions.</p>`)
							)}
						</div>
					</div>
					{data?.image && (
						<div className={`${styles.image} image`}>
							<img src={data.image.url} alt={data.image.name} />
						</div>
					)}
					{isPopup && (
						<div
							className={`${styles.closeIcon} ${isTopBannerActive ? styles.withTopBanner + " withTopBanner" : ""}`}
							onClick={() => {
								setActiveOrderPopup(false);
							}}
						>
							<div className={styles.line} />
							<div className={styles.line} />
						</div>
					)}
				</div>
			</div>
		</>
	);
}
