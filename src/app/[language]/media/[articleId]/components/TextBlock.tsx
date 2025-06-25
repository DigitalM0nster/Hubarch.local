import styles from "./styles.module.scss";
import parse from "html-react-parser";
import { ArticleBlockData, BlockTypeData } from "../getArticleData";

interface BlockProps {
	language: string;
	blockTypeData: BlockTypeData;
}

export default function TextBlock({ language, blockTypeData }: BlockProps) {
	return (
		<>
			{blockTypeData.title || blockTypeData.text ? (
				<div className={`${styles.textBlock}`}>
					{blockTypeData.title && <div className={styles.title}>{blockTypeData.title}</div>}
					{blockTypeData.text && <div className={styles.text}>{parse(blockTypeData.text)}</div>}
				</div>
			) : null}
		</>
	);
}
