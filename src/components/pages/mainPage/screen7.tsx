import styles from "./styles.module.scss";
import { useMainPageStore } from "@/store/mainPageStore";
import { usePreloaderStore } from "@/store/preloaderStore";
import { useEffect } from "react";
import { useWindowStore } from "@/store/windowStore";

export default function Screen7({ language }: { language: string }) {
	const { markReady } = usePreloaderStore();
	const { isMobile } = useWindowStore();
	const data = useMainPageStore((state) => state.data?.main_page_screen7);

	/* eslint-disable react-hooks/exhaustive-deps */
	useEffect(() => {
		if (data) {
			alert("gg7");
			markReady();
		}
	}, [data]);
	/* eslint-enable react-hooks/exhaustive-deps */

	return (
		<>
			<div
				className={`screen ${styles.screen7}`}
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
					<div className={styles.logoBlock}>
						<div className={styles.logo}>
							{Array.from({ length: 7 }).map((_, i) => {
								const letter = data?.letters?.[i];
								return (
									<div className={styles.letter} key={i}>
										<img className={letter?.image ? styles.animated : ""} src={`/images/mainPage/screen7/letter${i + 1}.svg`} alt="" />
										{letter?.image && <img src={letter.image.url} alt={letter.image.name} />}
									</div>
								);
							})}
						</div>
					</div>
					<div className={`${styles.adressesBlock} noScreenScrollZone`}>
						<div className={styles.adressItems}>
							<div className={`${styles.adressItem} scrollable`}>
								<div className={styles.adress}>MILANO, VIA PAOLO DA CANNOBIO 9 CAP</div>
								<ul className={styles.phones}>
									<li className={styles.phone}>+12345678911</li>
									<li className={styles.phone}>+12345678911</li>
								</ul>
								<ul className={styles.mails}>
									<li className={styles.mail}>verylongexample@verylongexample.com</li>
									<li className={styles.mail}>verylongexample@verylongexample.com</li>
									<li className={styles.mail}>verylongexample@verylongexample.com</li>
								</ul>
								<div className={styles.telegram}>@valentin_lavaweb_hello_monkey</div>
							</div>
							<div className={`${styles.adressItem} scrollable`}>
								<div className={styles.adress}>MILANO, VIA PAOLO DA CANNOBIO 9 CAP</div>
								<ul className={styles.phones}>
									<li className={styles.phone}>+12345678911</li>
									<li className={styles.phone}>+12345678911</li>
								</ul>
								<ul className={styles.mails}>
									<li className={styles.mail}>verylongexample@verylongexample.com</li>
									<li className={styles.mail}>verylongexample@verylongexample.com</li>
									<li className={styles.mail}>verylongexample@verylongexample.com</li>
								</ul>
								<div className={styles.telegram}>@valentin_lavaweb_hello_monkey</div>
							</div>
							<div className={`${styles.adressItem} scrollable`}>
								<div className={styles.adress}>MILANO, VIA PAOLO DA CANNOBIO 9 CAP</div>
								<ul className={styles.phones}>
									<li className={styles.phone}>+12345678911</li>
									<li className={styles.phone}>+12345678911</li>
								</ul>
								<ul className={styles.mails}>
									<li className={styles.mail}>verylongexample@verylongexample.com</li>
									<li className={styles.mail}>verylongexample@verylongexample.com</li>
									<li className={styles.mail}>verylongexample@verylongexample.com</li>
								</ul>
								<div className={styles.telegram}>@valentin_lavaweb_hello_monkey</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
