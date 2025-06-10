"use client";

import styles from "./styles.module.scss";
import parse from "html-react-parser";

interface PriceItem {
	text1: string;
	text2: string;
}

export default function TestfitComponent({ language, data }: { language: string; data: any }) {
	return (
		<div
			className={`screen ${styles.screen}`}
			data-screen-lightness="light"
			data-lines-index={1}
			data-mini-line-rotation={45}
			data-position-x={50}
			data-position-y={50}
			data-vertical-y={50}
			data-horizontal-x={50}
			data-horizontal-width={50}
			data-vertical-height={100}
			data-lines-color={"dark"}
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
								<div className={`${styles.icon} icon`} />
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
								<div className={`${styles.button} button callbackButton`}>
									<div className={`${styles.icon} icon`} />
									<div className={`${styles.text} text`}>Оставить заявку</div>
								</div>
								<div className={styles.description}>Нажимая на кнопку Отправить, вы соглашаетесь с Политикой конфиденциальности</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
