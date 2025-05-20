import styles from "./styles.module.scss";
import parse from "html-react-parser";

interface Ul {
	li: string;
}

interface UlList {
	ul_title: string;
	ul: Ul[] | false;
}

interface BlockArray {
	title: string;
	ul_list: UlList[] | false;
}

interface ScreenProps {
	language: string;
	projectId: string;
	projectData: any;
	blockData: {
		acf_fc_layout: string;
		block: BlockArray[] | false;
	};
}

export default function ContentListsScreen({ language, projectId, projectData, blockData }: ScreenProps) {
	if (blockData.block === false) {
		return null;
	}

	return (
		<div
			className={`screen active ${styles.screen} ${styles.contentListsScreen}`}
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
				{blockData.block.map((block, index) => {
					if (block.title === "" && block.ul_list === false) return null;

					return (
						<div className={styles.block} key={index}>
							{block.title != "" && <div className={styles.blockTitle}>{block.title}</div>}
							{block.ul_list != false && (
								<div className={styles.blockItemsList}>
									{block.ul_list.map((ul_list, blockItemIndex) => {
										if (ul_list.ul_title === "" && ul_list.ul === false) return null;

										return (
											<div key={`block-item-${blockItemIndex}`} className={`${styles.blockItem} ${ul_list.ul_title === "" ? styles.blockItemNoTitle : ""}`}>
												{ul_list.ul_title != "" && <div className={styles.blockItemTitle}>{ul_list.ul_title}</div>}
												{ul_list.ul != false && (
													<div className={styles.itemList}>
														{ul_list.ul.map((ul, itemIndex) => {
															if (ul.li === "") return null;

															return (
																<div key={`item-${blockItemIndex}-${itemIndex}`} className={styles.item}>
																	{ul.li}
																</div>
															);
														})}
													</div>
												)}
											</div>
										);
									})}
								</div>
							)}
						</div>
					);
				})}
			</div>
		</div>
	);
}
