import styles from "./styles.module.scss";
import { useMainPageStore } from "@/store/mainPageStore";
import { usePreloaderStore } from "@/store/preloaderStore";
import { useEffect, useRef, useState } from "react";
import { useWindowStore } from "@/store/windowStore";
import { useAreaRangeStore } from "@/store/areaRangeStore";
import { useInteractiveLinesStore } from "@/store/interactiveLinesStore";
import parse from "html-react-parser";

export default function Screen6({ language }: { language: string }) {
	const { markReady } = usePreloaderStore();
	const { isMobile } = useWindowStore();
	const { ranges } = useAreaRangeStore();

	const data = useMainPageStore((state) => state.data?.main_page_screen6);
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
		if (!name || !phone || !email || !selectedRange || !message) {
			setStatus("error");
			return;
		}

		setStatus("sending");

		try {
			// Тут ты можешь отправить данные куда нужно, например:
			await fetch("/api/send-form", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					name,
					phone,
					email,
					footage: selectedRange,
					message,
				}),
			});

			setStatus("success");
			// сбросить форму
			setName("");
			setPhone("");
			setEmail("");
			setSelectedRange(null);
			setMessage("");
		} catch (e) {
			setStatus("error");
		}
	};

	/* eslint-disable react-hooks/exhaustive-deps */
	useEffect(() => {
		if (data) {
			alert("gg6");
			markReady();
		}
	}, [data]);

	// КЛИК ЧТОБЫ УБИРАТЬ ДРОПДАУН
	useEffect(() => {
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

	/* eslint-enable react-hooks/exhaustive-deps */

	return (
		<>
			<div
				className={`screen ${styles.screen6}`}
				data-screen-lightness="light"
				data-lines-index={isMobile ? 1 : 1}
				data-mini-line-rotation={-45}
				data-position-x={isMobile ? 50 : 50}
				data-position-y={50}
				data-horizontal-x={isMobile ? 50 : 50}
				data-horizontal-width={isMobile ? 100 : 100}
				data-vertical-height={isMobile ? 100 : 100}
				data-lines-color={"dark"}
				data-left-line-x={0}
				data-left-line-height={0}
				data-right-line-x={100}
				data-right-line-height={0}
			>
				<div className={`screenContent ${styles.screenContent}`}>
					<div className={styles.titleBackgroundBlock}>
						{data?.title_background && <div className={`titleBackground ${styles.titleBackground}`}>{data?.title_background}</div>}
					</div>
					<div ref={formRef} className={styles.form}>
						<div className={styles.topPart}>
							<input
								type="text"
								onMouseEnter={(e) => {
									calculateInteractiveLines(e, -67.5);
								}}
								placeholder={language === "ru" ? "Имя" : "Name"}
								value={name}
								onChange={(e) => setName(e.target.value)}
							/>

							<input
								type="phone"
								onMouseEnter={(e) => {
									calculateInteractiveLines(e, -45);
								}}
								placeholder={language === "ru" ? "Телефон" : "Phone"}
								value={phone}
								onChange={(e) => setPhone(e.target.value)}
							/>
							<input
								type="email"
								onMouseEnter={(e) => {
									calculateInteractiveLines(e, -22.5);
								}}
								placeholder={language === "ru" ? "Email" : "Email"}
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
						</div>
						<div className={`${styles.bottomPart}`}>
							<div className={styles.formInputs}>
								<div
									ref={dropdownRef}
									className={`${styles.dropdown} ${dropdownOpen ? styles.active : ""}`}
									onMouseEnter={(e) => {
										calculateInteractiveLines(e, 22.5);
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
										onChange={(e) => setMessage(e.target.value)}
									/>
								</div>
								<div className={styles.buttonBlock}>
									<div className={styles.button} onClick={handleSubmit}>
										<div className={styles.icon} />
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
										{language === "ru" ? (
											<span>
												Нажимая на кнопку "Отправить" вы соглашаетесь c <span className={styles.privacyPolicy}>Политикой конфиденциальности</span>
											</span>
										) : (
											<span>
												By clicking the "Submit" button, you agree to the <span className={styles.privacyPolicy}>Privacy Policy</span>
											</span>
										)}
									</div>
								</div>
							</div>
						</div>
						{data?.additional_text && <div className={styles.textBlock}>{parse(data.additional_text)}</div>}
					</div>
					{data?.image && (
						<div className={styles.image}>
							<img src={data.image.url} alt={data.image.name} />
						</div>
					)}
				</div>
			</div>
		</>
	);
}
