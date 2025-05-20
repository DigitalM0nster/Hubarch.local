import styles from "./styles.module.scss";

interface ImageScreenProps {
	language: string;
	projectId: string;
	projectData: any;
	blockData: {
		acf_fc_layout: string;
		image: string | false;
		title: string;
	};
}

export default function ImageScreen({ language, projectId, projectData, blockData }: ImageScreenProps) {
	if (blockData.image === false && blockData.title === "") {
		return null;
	}

	return (
		<div
			className={`screen active ${styles.screen} ${styles.imageScreen}`}
			data-screen-lightness="light"
			data-lines-index={1}
			data-mini-line-rotation={45}
			data-position-x={50}
			data-position-y={50}
			data-vertical-y={50}
			data-horizontal-x={50}
			data-horizontal-width={100}
			data-vertical-height={50}
			data-lines-color={"dark"}
			data-left-line-x={0}
			data-left-line-height={0}
			data-right-line-x={100}
			data-right-line-height={0}
		>
			<div className={`screenContent ${styles.screenContent}`}>
				{blockData?.title && <div className={styles.screenTitle}>{blockData.title}</div>}
				{blockData?.image && (
					<div className={styles.imageBlock}>
						<img src={blockData.image} alt={blockData.title} />
					</div>
				)}
			</div>
		</div>
	);
}
