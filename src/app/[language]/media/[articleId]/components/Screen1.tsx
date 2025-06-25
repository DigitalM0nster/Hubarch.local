import styles from "./styles.module.scss";
import parse from "html-react-parser";

export default function Screen1({ articleData, language = "ru" }: { articleData: any | null; language: string }) {
	// Функция для форматирования даты (только год, месяц, день)
	const formatDate = (dateString: string) => {
		if (!dateString) return "";
		const date = new Date(dateString);

		// Получаем день, месяц и год
		const day = date.getDate().toString().padStart(2, "0");
		const month = (date.getMonth() + 1).toString().padStart(2, "0");
		const year = date.getFullYear();

		return `${day}.${month}.${year}`;
	};

	return (
		<div
			className={`screen active ${styles.screen} ${styles.screen1}`}
			data-screen-lightness="light"
			data-lines-index={1}
			data-mini-line-rotation={-45}
			data-position-x={50}
			data-position-y={50}
			data-vertical-y={33}
			data-horizontal-x={50}
			data-horizontal-width={100}
			data-vertical-height={65}
			data-lines-color={"dark"}
			data-left-line-x={0}
			data-left-line-height={0}
			data-right-line-x={100}
			data-right-line-height={0}
		>
			{articleData ? (
				<div className={`screenContent ${styles.screenContent}`}>
					<div className={styles.leftBlock}>
						<div className={styles.text}>{`«${articleData?.title?.rendered}»`}</div>
						<div className={styles.date}>{formatDate(articleData?.date)}</div>
					</div>
					<div className={styles.rightBlock}>
						<div className={styles.text}>{parse(articleData?.acf?.quote?.text)}</div>
						{articleData?.acf?.quote?.author && (
							<div className={styles.authorBlock}>
								<div className={styles.text}>{language === "ru" ? "Автор:" : "Author:"}</div>
								<div className={styles.authorName}>{articleData?.acf?.quote?.author}</div>
							</div>
						)}
					</div>
				</div>
			) : (
				<div className={`screenContent ${styles.screenContent}`}>
					<div className={styles.projectName}>{language === "ru" ? "Статья не найдена" : "Article not found"}</div>
				</div>
			)}
		</div>
	);
}
