"use client";

import Link from "next/link";
import styles from "./styles.module.scss";

export default function BottomHud() {
	return (
		<>
			<div className={styles.bottomHud}>
				<div className={styles.leftPart}>
					<Link href="/contacts" className={styles.li}>
						Контакты
					</Link>
				</div>
				<div className={styles.rightPart}>
					<div className={styles.stoneIcon}>
						<img src="/images/stone.svg" />
					</div>
				</div>
			</div>
		</>
	);
}
