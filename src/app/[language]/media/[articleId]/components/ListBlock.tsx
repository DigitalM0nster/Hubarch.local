import styles from "./styles.module.scss";
import parse from "html-react-parser";
import { ArticleBlockData, BlockTypeData } from "../getArticleData";

interface BlockProps {
	language: string;
	blockTypeData: BlockTypeData;
	blockIndex: number;
}

export default function ListBlock({ language, blockTypeData, blockIndex }: BlockProps) {
	console.log(blockTypeData);
	return (
		<>
			{blockTypeData.title || (blockTypeData.list != false && blockTypeData.list.length > 0) ? (
				<div className={`${styles.textBlock} ${styles.listBlock}`}>
					{blockTypeData.title && <div className={styles.title}>{blockTypeData.title}</div>}
					{blockTypeData.list != false && blockTypeData.list.length > 0 && (
						<div className={styles.listItems}>
							{blockTypeData.list.map((listItem, index) => {
								return (
									<div className={styles.listItem} key={`blockItem-${blockIndex}_listItem-${index}`}>
										<div className={styles.number}>{`( ${index + 1} )`}</div>
										<div className={styles.text}>{parse(listItem.list_li)}</div>
									</div>
								);
							})}
						</div>
					)}
				</div>
			) : null}
		</>
	);
}
