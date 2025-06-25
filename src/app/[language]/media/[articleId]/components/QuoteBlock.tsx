import styles from "./styles.module.scss";
import parse from "html-react-parser";
import { ArticleBlockData, BlockTypeData } from "../getArticleData";

interface BlockProps {
	language: string;
	blockTypeData: BlockTypeData;
}

export default function QuoteBlock({ language, blockTypeData }: BlockProps) {
	return (
		<>
			{blockTypeData.author || blockTypeData.position || blockTypeData.text ? (
				<div className={`${styles.textBlock} ${styles.quoteBlock}`}>
					{blockTypeData.text && <div className={styles.text}>{parse(blockTypeData.text)}</div>}
					{(blockTypeData.author || blockTypeData.position) && (
						<div className={styles.authorBlock}>
							{blockTypeData.author && <div className={styles.author}>{blockTypeData.author}</div>}
							{blockTypeData.position && <div className={styles.position}>{blockTypeData.position}</div>}
						</div>
					)}
				</div>
			) : null}
		</>
	);
}
