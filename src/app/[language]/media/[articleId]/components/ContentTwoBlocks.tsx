import styles from "./styles.module.scss";
import parse from "html-react-parser";
import { ArticleBlockData, BlockTypeData, ArticleData } from "../getArticleData";
import ImageBlock from "./ImageBlock";
import QuoteBlock from "./QuoteBlock";
import LinkBlock from "./LinkBlock";
import ListBlock from "./ListBlock";
import TextBlock from "./TextBlock";

interface BlockProps {
	language: string;
	articleId: string;
	articleData: ArticleData;
	articleBlockData: ArticleBlockData;
}

export default function ContentTwoBlocks({ language, articleId, articleData, articleBlockData }: BlockProps) {
	const ConstructorMap: Record<string, React.FC<{ blockTypeData: BlockTypeData; language: string; blockIndex: number }>> = {
		image_block: ImageBlock,
		quote_block: QuoteBlock,
		link_block: LinkBlock,
		list_block: ListBlock,
		text_block: TextBlock,
	};

	return (
		<div
			className={`screen ${styles.screen} ${styles.contentTwoBlocks} contentTwoBlocks`}
			data-screen-lightness="light"
			data-lines-index={0}
			data-mini-line-rotation={45}
			data-position-x={50}
			data-position-y={50}
			data-vertical-y={50}
			data-horizontal-x={50}
			data-horizontal-width={100}
			data-vertical-height={100}
			data-lines-color={"dark"}
			data-left-line-x={0}
			data-left-line-height={0}
			data-right-line-x={100}
			data-right-line-height={0}
		>
			<div className={`screenContent ${styles.screenContent}`}>
				<div className={styles.leftBlock}>
					{articleBlockData.left_block != false &&
						articleBlockData.left_block?.map((BlockType: BlockTypeData, blockIndex: number) => {
							const BlockTypeComponent = ConstructorMap[BlockType.acf_fc_layout];

							return <BlockTypeComponent key={`blockType-${blockIndex}`} blockTypeData={BlockType} language={language} blockIndex={blockIndex} />;
						})}
				</div>
				<div className={styles.rightBlock}>
					{articleBlockData.right_block != false &&
						articleBlockData.right_block?.map((BlockType: BlockTypeData, blockIndex: number) => {
							const BlockTypeComponent = ConstructorMap[BlockType.acf_fc_layout];

							return <BlockTypeComponent key={`blockType-${blockIndex}`} blockTypeData={BlockType} language={language} blockIndex={blockIndex} />;
						})}
				</div>
			</div>
		</div>
	);
}
