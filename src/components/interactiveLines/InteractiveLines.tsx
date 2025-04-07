"use client";

import { useInteractiveLinesStore } from "@/store/interactiveLinesStore";
import styles from "./styles.module.scss";
import { useEffect, useRef } from "react";
import { useHudMenuStore } from "@/store/hudMenuStore";

export default function InteractiveLines() {
	const { zIndex, active, miniLine, verticalLine, horizontalLine, rightLine, leftLine, linesColor } = useInteractiveLinesStore();
	const { activeMenu } = useHudMenuStore();
	const interactiveLinesRef = useRef<HTMLDivElement | null>(null);
	const verticalLineRef = useRef<HTMLDivElement | null>(null);
	const horizontalLineRef = useRef<HTMLDivElement | null>(null);
	const miniLineRef = useRef<HTMLDivElement | null>(null);
	const leftLineRef = useRef<HTMLDivElement | null>(null);
	const rightLineRef = useRef<HTMLDivElement | null>(null);

	// useEffect(() => {
	// 	horizontalLineRef.current?.style.setProperty("left", `${verticalLine.x}%`);
	// }, [horizontalLine.x]);

	useEffect(() => {
		miniLineRef.current?.style.setProperty("top", `${horizontalLine.y}%`);
		horizontalLineRef.current?.style.setProperty("top", `${horizontalLine.y}%`);
	}, [horizontalLine.y]);

	// useEffect(() => {
	// 	verticalLineRef.current?.style.setProperty("left", `${verticalLine.x}%`);
	// 	miniLineRef.current?.style.setProperty("left", `${verticalLine.x}%`);
	// }, [verticalLine.x]);

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
			<div className={`screenContent ${styles.linesBlock} ${linesColor === "light" ? styles.light : ""}`}>
				<div
					ref={verticalLineRef}
					className={`${styles.line} ${styles.verticalLine}`}
					style={{
						left: `${verticalLine.x}%`,
						height: `${verticalLine.height}%`,
					}}
				/>
				<div
					ref={horizontalLineRef}
					className={`${styles.line} ${styles.horizontalLine}`}
					style={{
						top: `${horizontalLine.y}%`,
						left: `${verticalLine.x}%`,
						width: `${horizontalLine.width}%`,
					}}
				/>
				<div
					ref={miniLineRef}
					className={`${styles.line} ${styles.miniLine}`}
					style={{
						top: `${horizontalLine.y}%`,
						left: `${verticalLine.x}%`,
						transform: `translate(-50%, -50%) rotate(${miniLine.rotation}deg)`,
					}}
				/>
				<div
					ref={leftLineRef}
					className={`${styles.line} ${styles.leftLine}`}
					style={{
						height: `${leftLine.height}%`,
						left: `calc(${leftLine.x}% - 0px)`,
						transition: "transform 0.5s ease-in-out",
					}}
				/>
				<div
					ref={rightLineRef}
					className={`${styles.line} ${styles.rightLine}`}
					style={{
						height: `${rightLine.height}%`,
						left: `calc(${rightLine.x}% - 0px)`,
						transition: "transform 0.5s ease-in-out",
					}}
				/>
				{/* <div className={styles.icon}>
					<div className={`${styles.line}`} />
					<div className={`${styles.line}`} />
					<div className={`${styles.line}`} />
				</div> */}
			</div>
		</div>
	);
}
