// src\app\[language]\projects\[projectId]\ProjectId.tsx

import ClientComponent from "./components/ClientComponent";
import styles from "./components/styles.module.scss";

import Screen1 from "./components/Screen1";
import ContentOneBlock from "./components/ContentOneBlock";
import ContentTwoBlocks from "./components/ContentTwoBlocks";
import { ArticleBlockData } from "./getArticleData";
import LinkWithPreloader from "@/components/preloader/LinkWithPreloader";

interface ArticleIdPageProps {
	language: string;
	articleId: string;
	articleData: any;
}

export default function ArticleIdPage({ language, articleId, articleData }: ArticleIdPageProps) {
	const ConstructorMap: Record<string, React.FC<{ articleBlockData: ArticleBlockData; language: string; articleId: string; articleData: any }>> = {
		two_blocks: ContentTwoBlocks,
		one_block: ContentOneBlock,
	};

	return (
		<>
			<div className={`screenScroll ${styles.screenScroll} ${styles.simpleScroll} simpleScroll`} id="articleContainer">
				<ClientComponent articleData={articleData} />
				<Screen1 articleData={articleData} language={language} />
				{articleData?.acf?.article_blocks != false &&
					articleData?.acf?.article_blocks?.map((articleBlock: any, index: number) => {
						const BlockComponent = ConstructorMap[articleBlock.acf_fc_layout];

						return <BlockComponent key={index} articleBlockData={articleBlock} language={language} articleId={articleId} articleData={articleData} />;
					})}
			</div>
		</>
	);
}
