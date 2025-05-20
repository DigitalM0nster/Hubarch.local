import styles from "./styles.module.scss";
import parse from "html-react-parser";

interface ScreenProps {
	language: string;
	projectId: string;
	projectData: any;
	blockData: {
		acf_fc_layout: string;
		content: {
			text: string;
			description: string;
			image: string | false;
		};
		title: string;
	};
}

export default function ContentCenterScreen({ language, projectId, projectData, blockData }: ScreenProps) {
	if (blockData.content.image === false && blockData.title === "" && blockData.content.description === "" && blockData.content.text === "") {
		return null;
	}

	return (
		<div
			className={`screen active ${styles.screen} ${styles.contentCenterScreen} contentCenterScreen`}
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
				{blockData?.content?.image ? (
					<div className={styles.imageBlock}>
						<img src={blockData.content.image} alt={blockData.content.text} />
						{(blockData?.content?.text !== "" || blockData?.content?.description !== "") && (
							<div className={`${styles.textBlock} ${!blockData?.content?.image ? styles.noImage : ""}`}>
								{blockData?.content?.text !== "" && <div className={styles.text}>{blockData.content.text}</div>}
								{blockData?.content?.description !== "" && <div className={styles.description}>{parse(blockData.content.description)}</div>}
								{blockData?.content?.description !== "" && <div className={styles.scrollOverlay} />}
							</div>
						)}
					</div>
				) : (
					(blockData?.content?.text !== "" || blockData?.content?.description !== "") && (
						<div className={`${styles.textBlock} ${!blockData?.content?.image ? styles.noImage : ""}`}>
							{blockData?.content?.text !== "" && <div className={styles.text}>{blockData.content.text}</div>}
							{blockData?.content?.description !== "" && <div className={styles.description}>{parse(blockData.content.description)}</div>}
							{blockData?.content?.description !== "" && <div className={styles.scrollOverlay} />}
						</div>
					)
				)}
			</div>
		</div>
	);
}
