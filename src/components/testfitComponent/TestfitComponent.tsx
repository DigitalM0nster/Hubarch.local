"use client";

import { useWindowStore } from "@/store/windowStore";
import styles from "./styles.module.scss";
import parse from "html-react-parser";
import { useHudMenuStore } from "@/store/hudMenuStore";

interface PriceItem {
	text1: string;
	text2: string;
}

export default function TestfitComponent({ language, data, text_is_light = false }: { language: string; data: any; text_is_light?: boolean }) {
	const { isMobile } = useWindowStore();
	const { activeOrderPopup, setActiveOrderPopup } = useHudMenuStore();
	return (
		<div
			className={`screen ${styles.screen}`}
			data-screen-lightness={text_is_light ? "dark" : "light"}
			data-lines-index={isMobile ? 0 : 1}
			data-mini-line-rotation={45}
			data-position-x={50}
			data-position-y={50}
			data-vertical-y={50}
			data-horizontal-x={50}
			data-horizontal-width={50}
			data-vertical-height={100}
			data-lines-color={text_is_light ? "light" : "dark"}
			data-left-line-x={0}
			data-left-line-height={0}
			data-right-line-x={100}
			data-right-line-height={0}
		>
			<div className={`screenContent ${styles.screenContent}`}>
				<div className={styles.leftPart}>
					{data?.left_block?.text && <div className={styles.textBlock}>{parse(data?.left_block?.text)}</div>}
					{data?.left_block?.image != false && (
						<div className={styles.imageBlock}>
							<img src={data?.left_block?.image} alt="" />
						</div>
					)}
				</div>
				<div className={styles.rightPart}>
					<div className={styles.textBlock}>
						{data?.right_block?.text != "" && <div className={styles.text}>{data?.right_block?.text && parse(data?.right_block?.text)}</div>}
						{data?.right_block?.button.text != "" && data?.right_block?.button.link != "" && (
							<a href={data?.right_block?.button.link} className={`${styles.button} button`}>
								<div className={`${styles.icon} icon`}>
									<svg xmlns="http://www.w3.org/2000/svg" width="21" height="22" viewBox="0 0 21 22" fill="none">
										<path
											fillRule="evenodd"
											clipRule="evenodd"
											d="M4.24669 17.2533C7.7003 20.7069 13.2997 20.7069 16.7533 17.2533C20.2069 13.7997 20.2069 8.2003 16.7533 4.74669C13.2997 1.29309 7.7003 1.29309 4.24669 4.74669C0.793087 8.2003 0.793087 13.7997 4.24669 17.2533ZM3.07538 18.4246C7.17588 22.5251 13.8241 22.5251 17.9246 18.4246C22.0251 14.3241 22.0251 7.67588 17.9246 3.57538C13.8241 -0.525126 7.17588 -0.525126 3.07538 3.57538C-1.02513 7.67588 -1.02513 14.3241 3.07538 18.4246Z"
											fill="var(--mainTextColor)"
										/>
										<path d="M10.0097 5.4841L15.6774 11.1517L14.5061 12.3231L8.8384 6.65541L10.0097 5.4841Z" fill="var(--mainTextColor)" />
										<path d="M15.6772 11.1516L10.0096 16.8193L8.83828 15.648L14.5059 9.98031L15.6772 11.1516Z" fill="var(--mainTextColor)" />
										<path d="M14.4709 11.8277H0.924743V10.1712H14.4709V11.8277Z" fill="var(--mainTextColor)" />
									</svg>
								</div>
								<div className={`${styles.text} text`}>{data?.right_block?.button.text}</div>
							</a>
						)}
					</div>
					{data?.right_block?.price_block && (
						<div className={styles.priceBlock}>
							<div className={styles.priceItems}>
								{data?.right_block?.price_block?.map((item: PriceItem, index: number) => (
									<div className={styles.priceItem} key={`priceItem-${index}`}>
										<div className={styles.meters}>{item.text1}</div>
										<div className={styles.price}>{item.text2}</div>
									</div>
								))}
							</div>
							<div className={styles.callbackButtonBlock}>
								<div
									className={`${styles.button} button callbackButton`}
									onClick={() => {
										setActiveOrderPopup(true);
									}}
								>
									<div className={`${styles.icon} icon`}>
										<svg xmlns="http://www.w3.org/2000/svg" width="21" height="22" viewBox="0 0 21 22" fill="none">
											<path
												fillRule="evenodd"
												clipRule="evenodd"
												d="M4.24669 17.2533C7.7003 20.7069 13.2997 20.7069 16.7533 17.2533C20.2069 13.7997 20.2069 8.2003 16.7533 4.74669C13.2997 1.29309 7.7003 1.29309 4.24669 4.74669C0.793087 8.2003 0.793087 13.7997 4.24669 17.2533ZM3.07538 18.4246C7.17588 22.5251 13.8241 22.5251 17.9246 18.4246C22.0251 14.3241 22.0251 7.67588 17.9246 3.57538C13.8241 -0.525126 7.17588 -0.525126 3.07538 3.57538C-1.02513 7.67588 -1.02513 14.3241 3.07538 18.4246Z"
												fill="var(--mainTextColor)"
											/>
											<path d="M10.0097 5.4841L15.6774 11.1517L14.5061 12.3231L8.8384 6.65541L10.0097 5.4841Z" fill="var(--mainTextColor)" />
											<path d="M15.6772 11.1516L10.0096 16.8193L8.83828 15.648L14.5059 9.98031L15.6772 11.1516Z" fill="var(--mainTextColor)" />
											<path d="M14.4709 11.8277H0.924743V10.1712H14.4709V11.8277Z" fill="var(--mainTextColor)" />
										</svg>
									</div>
									<div className={`${styles.text} text`}>
										{language === "ru"
											? data?.right_block?.order_button?.button_text || "Оставить заявку"
											: data?.right_block?.order_button?.button_text || "Send a request"}
									</div>
								</div>
								{data?.right_block?.order_button?.accept_text && <div className={styles.description}>parse(data?.right_block?.order_button?.accept_text)</div>}
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
