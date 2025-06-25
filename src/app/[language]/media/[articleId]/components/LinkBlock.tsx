import styles from "./styles.module.scss";
import parse from "html-react-parser";
import { ArticleBlockData, BlockTypeData } from "../getArticleData";
import Link from "next/link";

interface BlockProps {
	language: string;
	blockTypeData: BlockTypeData;
}

export default function LinkBlock({ language, blockTypeData }: BlockProps) {
	return (
		<>
			{blockTypeData.link && blockTypeData.text ? (
				<div className={`${styles.textBlock} ${styles.linkBlock}`}>
					<Link href={blockTypeData.link} className={styles.linkItem}>
						<div className={styles.icon} />
						<div className={styles.link}>{blockTypeData.text}</div>
					</Link>
				</div>
			) : null}
		</>
	);
}
