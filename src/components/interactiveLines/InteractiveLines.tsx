"use client";

import { useInteractiveLinesStore } from "@/store/interactiveLinesStore";
import styles from "./styles.module.scss";
import { useEffect, useRef } from "react";
import { useHudMenuStore } from "@/store/hudMenuStore";

export default function InteractiveLines() {
	const { zIndex, active, miniLine, verticalLine } = useInteractiveLinesStore();
	const { activeMenu } = useHudMenuStore();
	const interactiveLinesRef = useRef<HTMLDivElement | null>(null);
	const verticalLineRef = useRef<HTMLDivElement | null>(null);
	const horizontalLineRef = useRef<HTMLDivElement | null>(null);
	const miniLineRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		miniLineRef.current?.style.setProperty("transform", `translate(-50%, -50%) rotate(${miniLine.rotation}deg)`);
	}, [miniLine]);

	useEffect(() => {
		verticalLineRef.current?.style.setProperty("left", `${verticalLine.x}%`);
		miniLineRef.current?.style.setProperty("left", `${verticalLine.x}%`);
	}, [verticalLine.x]);

	useEffect(() => {
		interactiveLinesRef.current?.style.setProperty("z-index", zIndex.toString());
	}, [zIndex]);

	useEffect(() => {
		if (activeMenu) {
			interactiveLinesRef.current?.style.setProperty("transition", "all 1s 0s, z-index 0s 0s");
		} else {
			interactiveLinesRef.current?.style.setProperty("transition", "all 1s 0s, z-index 0s 0.5s");
		}
	}, [activeMenu]);

	return (
		<div ref={interactiveLinesRef} className={`${styles.interactiveLines} ${active ? styles.active : ""}`}>
			<div className={`screenContent ${styles.linesBlock}`}>
				<div ref={verticalLineRef} className={`${styles.line} ${styles.verticalLine}`} />
				<div ref={horizontalLineRef} className={`${styles.line} ${styles.horizontalLine}`} />
				<div ref={miniLineRef} className={`${styles.line} ${styles.miniLine}`} />
				{/* <div className={styles.icon}>
					<div className={`${styles.line}`} />
					<div className={`${styles.line}`} />
					<div className={`${styles.line}`} />
				</div> */}
			</div>
		</div>
	);
}
