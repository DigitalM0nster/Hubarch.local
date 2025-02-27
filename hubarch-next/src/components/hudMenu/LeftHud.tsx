"use client";

import Link from "next/link";
import styles from "./styles.module.scss";

export default function LeftHud() {
	return (
		<>
			<div className={styles.leftHud}>
				<Link href="/media" className={styles.li}>
					Медиа
				</Link>
			</div>
		</>
	);
}
