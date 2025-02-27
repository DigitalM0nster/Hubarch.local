"use client";

import Link from "next/link";
import styles from "./styles.module.scss";

export default function RightHud() {
	return (
		<>
			<div className={styles.rightHud}>
				<Link href="/projects" className={styles.li}>
					Проекты
				</Link>
			</div>
		</>
	);
}
