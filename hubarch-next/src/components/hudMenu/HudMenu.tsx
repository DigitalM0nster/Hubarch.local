"use client";

import TopHud from "./TopHud";
import RightHud from "./RightHud";
import LeftHud from "./LeftHud";
import BottomHud from "./BottomHud";
import styles from "./styles.module.scss";

export default function HudMenu() {
	return (
		<>
			<div className={styles.hudMenu}>
				<TopHud />
				<RightHud />
				<BottomHud />
				<LeftHud />
			</div>
		</>
	);
}
