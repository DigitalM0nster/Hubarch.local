import styles from "./styles.module.scss";

export default function Screen1({ projectData }: { projectData: any }) {
	return (
		<div
			className={`screen active ${styles.screen} ${styles.screen1}`}
			data-screen-lightness="dark"
			data-lines-index={1}
			data-mini-line-rotation={-45}
			data-position-x={50}
			data-position-y={50}
			data-vertical-y={37}
			data-horizontal-x={50}
			data-horizontal-width={100}
			data-vertical-height={65}
			data-lines-color={"light"}
			data-left-line-x={0}
			data-left-line-height={0}
			data-right-line-x={100}
			data-right-line-height={0}
		>
			<div className={styles.backgroundImage}>
				<img src={projectData.acf.project_preview} alt={projectData.title.rendered} />
				<div className={styles.overlay} />
			</div>
			<div className={`screenContent ${styles.screenContent}`}>
				<div className={styles.projectName}>{projectData.title.rendered}</div>
			</div>
		</div>
	);
}
