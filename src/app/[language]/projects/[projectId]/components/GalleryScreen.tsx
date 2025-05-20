import styles from "./styles.module.scss";
import InfiniteGallery from "./InfiniteGallery";

interface ScreenProps {
	language: string;
	projectId: string;
	projectData: any;
	blockData: {
		acf_fc_layout: string;
		images_list: string[] | false;
	};
}

export default function GalleryScreen({ language, projectId, projectData, blockData }: ScreenProps) {
	if (blockData.images_list === false) {
		return null;
	}

	return (
		<div
			className={`screen active ${styles.screen} ${styles.galleryScreen}`}
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
				<InfiniteGallery images={blockData.images_list || []} />
			</div>
		</div>
	);
}
