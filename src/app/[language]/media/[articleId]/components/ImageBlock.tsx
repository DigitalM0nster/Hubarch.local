import styles from "./styles.module.scss";
import parse from "html-react-parser";
import { ArticleBlockData, BlockTypeData } from "../getArticleData";

interface BlockProps {
	language: string;
	blockTypeData: BlockTypeData;
}

export default function ImageBlock({ language, blockTypeData }: BlockProps) {
	return (
		<>
			{blockTypeData.image != false ? (
				<div className={`${styles.imageBlock}`}>
					<img src={blockTypeData.image} alt="" />
				</div>
			) : null}
		</>
	);
}
