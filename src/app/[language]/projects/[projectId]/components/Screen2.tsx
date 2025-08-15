import LinkWithPreloader from "@/components/preloader/LinkWithPreloader";
import styles from "./styles.module.scss";

export default function Screen2({ language, projectData }: { language: string; projectData: any }) {
	return (
		<div
			className={`screen ${styles.screen} ${styles.screen2}`}
			data-screen-lightness="light"
			data-lines-index={1}
			data-mini-line-rotation={-45}
			data-position-x={50}
			data-position-y={50}
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
				<div
					className={`${styles.content} ${!projectData?.acf?.project_services && !projectData?.acf?.project_team ? styles.noFirstBlock : ""} ${
						projectData?.acf?.project_services != false && projectData?.acf?.project_team != false ? styles.twoBlocks : ""
					} ${projectData?.acf?.project_articles === false ? styles.noArticles : ""}`}
				>
					<div className={`${styles.block} ${styles.teamServicesBlock}`}>
						{projectData.acf.project_services != false && (
							<div className={styles.projectServices}>
								<div className={styles.blockTitle}>{language === "ru" ? "Услуги" : "Services"}</div>
								<ul>
									{projectData?.acf?.project_services?.map((item: any, index: number) => {
										return (
											<li key={`service${index}`} className={styles.text}>
												{item.service}
											</li>
										);
									})}
								</ul>
							</div>
						)}
						{projectData?.acf?.project_team != false && (
							<div className={styles.projectTeam}>
								<div className={styles.blockTitle}>{language === "ru" ? "Команда" : "Team"}</div>
								<ul>
									{projectData?.acf?.project_team?.map((item: any, index: number) => {
										return (
											<li key={`team_member${index}`} className={styles.text}>
												{item.team_member}
											</li>
										);
									})}
								</ul>
							</div>
						)}
					</div>
					<div className={`${styles.block} ${styles.projectAboutBlock}`}>
						{projectData?.acf?.project_description != false ? (
							<div className={styles.projectAbout}>
								<div className={styles.blockTitle}>{language === "ru" ? "О проекте" : "About the project"}</div>
								<div className={styles.text}>{projectData.acf.project_description}</div>
								{projectData?.acf?.project_city_year && <div className={styles.cityYear}>{projectData?.acf?.project_city_year}</div>}
							</div>
						) : (
							<div className={styles.projectAbout}>
								<div className={styles.blockTitle}></div>
								<div className={styles.text}></div>
								{projectData?.acf?.project_city_year && <div className={styles.cityYear}>{projectData?.acf?.project_city_year}</div>}
							</div>
						)}
					</div>

					<div className={`${styles.block} ${styles.projectSpaceBlock}`}>
						<div className={styles.projectSpace}>
							{projectData?.acf?.project_footage && (
								<div className={styles.text}>
									{projectData.acf.project_footage} {language === "ru" ? "м²" : "m²"}
								</div>
							)}
						</div>
					</div>

					{projectData?.acf?.project_articles != false && (
						<div className={`${styles.block} ${styles.projectArticlesBlock}`}>
							<div className={styles.projectSmi}>
								<div className={styles.blockTitle}>
									{projectData?.acf?.project_articles?.length > 1
										? language === "ru"
											? "Публикации в СМИ"
											: "Publications in the media"
										: language === "ru"
										? "Публикация в СМИ"
										: "Publication in the media"}
								</div>
								{projectData?.acf?.project_articles?.map((item: any, index: number) => {
									return (
										<div key={`smiBlock${index}`} className={styles.smiBlock}>
											<div className={`${styles.text} ${styles.date}`}>
												{item.article.post_date
													? new Date(item.article.post_date)
															.toLocaleDateString("ru-RU", {
																day: "2-digit",
																month: "2-digit",
																year: "numeric",
															})
															.replace(/\//g, ".")
													: ""}
											</div>
											<LinkWithPreloader href={`/${language}/media/${item.article.post_name}`} className={styles.linkBlock}>
												<div className={styles.linkText}>{item.article.post_title}</div>
												<div className={styles.link}>
													<div className={styles.arrow} />
													<div className={styles.text}>{language === "ru" ? "Подробнее" : "Read more"}</div>
												</div>
											</LinkWithPreloader>
										</div>
									);
								})}
							</div>
						</div>
					)}
				</div>
				<div className={styles.awardsBlock}>
					{projectData?.acf?.project_awards != false && <div className={styles.blockTitle}>Awards</div>}
					{projectData?.acf?.project_awards?.length > 0 && (
						<div className={styles.awardsList}>
							{projectData.acf.project_awards.map((item: any, index: number) => {
								// Проверяем, есть ли ещё премии с тем же term_id (то есть, в других годах)
								const isMultipleYears = projectData.acf.project_awards.filter((e: any) => e.term_id === item.term_id).length > 1;

								return (
									<div
										key={`${item.term_id}-${item.year}`}
										className={styles.award}
										style={{
											backgroundColor: item.acf?.award_background_color || "transparent",
										}}
									>
										<div className={styles.linesBlock}>
											<div className={styles.line} />
											<div className={styles.line} />
											<div className={styles.line} />
											<div className={styles.line} />
										</div>
										<div className={styles.topBlock}>
											<div
												className={styles.awardName}
												style={{
													color: item.acf?.award_text_color || "white",
												}}
											>
												{item.name}
											</div>
											<div
												className={`${styles.awardYear} ${isMultipleYears ? styles.active : ""}`}
												style={{
													color: item.acf?.award_text_color || "white",
												}}
											>
												{item.year}
											</div>
										</div>
										<div className={styles.image}>
											{item.acf?.award_image ? (
												<img src={item.acf.award_image} alt={item.name} />
											) : (
												<div
													className={styles.noImageAwardName}
													style={{
														color: item.acf?.award_text_color || "white",
													}}
												>
													{item.name}
												</div>
											)}
										</div>

										<div
											className={styles.nominationsList}
											style={{
												color: item.acf?.award_text_color || "white",
											}}
										>
											{item.nominations?.map((nom: any, i: number) => (
												<div key={i} className={styles.nomination}>
													«{nom.nomination}»
												</div>
											))}
										</div>
									</div>
								);
							})}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
