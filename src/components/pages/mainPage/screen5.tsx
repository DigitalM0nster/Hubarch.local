import styles from "./styles.module.scss";
import { useMainPageStore } from "@/store/mainPageStore";
import { usePreloaderStore } from "@/store/preloaderStore";
import { useEffect, useRef, useState } from "react";
import LinkWithPreloader from "@/components/preloader/LinkWithPreloader";
import { useWindowStore } from "@/store/windowStore";

export default function Screen5({ language }: { language: string }) {
	const { markReady } = usePreloaderStore();
	const { windowWidth, windowHeight } = useWindowStore();

	const data = useMainPageStore((state) => state.data?.main_page_screen5);
	const { mainPageFetchingFinished } = useMainPageStore();

	const screenContentRef = useRef<HTMLDivElement>(null);
	const aboutPersonRefs = useRef<(HTMLDivElement | null)[]>([]);
	const phrasesRefs = useRef<(HTMLDivElement | null)[]>([]);
	const personRefs = useRef<(HTMLDivElement | null)[]>([]);
	const gapRef = useRef<number>(8);
	const frameDifferenceRef = useRef<number>(gapRef.current * 0.5);

	const [aboutPersonTallestIndex, setAboutPersonTallestIndex] = useState<number | null>(null);
	const [phrasesTallestIndex, setPhrasesTallestIndex] = useState<number | null>(null);
	const [hoveredIndex, setHoveredIndex] = useState<number | null>(0);

	const [xLine, setXLine] = useState<number | null>(75);

	const frameRef = useRef<HTMLDivElement | null>(null);
	const [frameTop, setFrameTop] = useState(0);
	const [frameLeft, setFrameLeft] = useState(0);
	const personsListRef = useRef<HTMLDivElement | null>(null);

	/* eslint-disable react-hooks/exhaustive-deps */
	useEffect(() => {
		if (mainPageFetchingFinished) {
			markReady();
		}
	}, [mainPageFetchingFinished]);

	// Движение рамки по фотографиям
	useEffect(() => {
		if (frameRef.current && personRefs.current[0]) {
			const frameRect = frameRef.current.getBoundingClientRect();
			const personRect = personRefs.current[0].getBoundingClientRect();
			frameDifferenceRef.current = frameRect.height - personRect.height;
		}

		if (personsListRef.current) {
			const styles = window.getComputedStyle(personsListRef.current);
			const gap = parseFloat(styles.getPropertyValue("row-gap"));
			gapRef.current = gap;
		}

		const itemRect = personRefs.current[0]?.getBoundingClientRect();
		const itemHeight = itemRect?.height || 0;
		const itemWidth = itemRect?.width || 0;

		if (window.innerWidth > 1280) {
			setFrameLeft(gapRef.current * -0.5);
			setFrameTop(hoveredIndex !== null ? hoveredIndex * (itemHeight + gapRef.current) - frameDifferenceRef.current * 0.5 : 0);
		} else {
			setFrameLeft(hoveredIndex !== null ? hoveredIndex * (itemWidth + gapRef.current) - frameDifferenceRef.current * 0.5 : 0);
			setFrameTop(gapRef.current * -0.5);
		}
	}, [hoveredIndex, windowWidth, windowHeight]);

	/* eslint-enable react-hooks/exhaustive-deps */

	const rawTeamList = data?.team_list || [];
	type Person = {
		photo: string | false;
		name: string;
		post: string;
		mail: string;
		phrase: string;
		icon: string | false;
	};

	const teamList: Person[] = Array.from({ length: 6 }).map((_, index) => {
		const person = rawTeamList[index] as Partial<Person> | undefined;
		return {
			photo: person?.photo || false,
			name: person?.name || "",
			post: person?.post || "",
			mail: person?.mail || "",
			phrase: person?.phrase || "",
			icon: person?.icon || false,
		};
	});

	// Определяем самые высокие блоки
	useEffect(() => {
		if (!aboutPersonRefs.current) return;

		const aboutPersonHeights = aboutPersonRefs.current.map((el) => el?.offsetHeight || 0);
		const aboutPersonMaxHeight = Math.max(...aboutPersonHeights);
		const aboutPersonMaxIndex = aboutPersonHeights.findIndex((h) => h === aboutPersonMaxHeight);

		const phrasesHeights = phrasesRefs.current.map((el) => el?.offsetHeight || 0);
		const phrasesMaxHeight = Math.max(...phrasesHeights);
		const phrasesMaxIndex = phrasesHeights.findIndex((h) => h === phrasesMaxHeight);

		setAboutPersonTallestIndex(aboutPersonMaxIndex);
		setPhrasesTallestIndex(phrasesMaxIndex);
	}, [teamList, windowWidth, windowHeight]);

	// Вычисляем положение линии
	useEffect(() => {
		if (screenContentRef.current) {
			const screenContentWidth = screenContentRef.current.getBoundingClientRect().width;
			const centerOfImage = windowWidth * 0.75;
			const screenSidePadding = (windowWidth - screenContentWidth) / 2;
			const pointXInsideContent = centerOfImage - screenSidePadding;
			const pointXInsideContentPercent = (pointXInsideContent / screenContentWidth) * 100;

			setXLine(pointXInsideContentPercent);
		}
	}, [windowWidth, windowHeight]);

	return (
		<>
			<div
				className={`screen ${styles.screen5}`}
				data-screen-lightness="light"
				data-lines-index={2}
				data-mini-line-rotation={45}
				data-position-x={windowWidth <= 980 ? 50 : windowWidth <= 1280 ? xLine : 50}
				data-position-y={windowWidth <= 980 ? 50 : windowWidth <= 1280 ? 50 : 50}
				data-horizontal-x={windowWidth <= 980 ? 50 : windowWidth <= 1280 ? xLine : 50}
				data-horizontal-width={windowWidth <= 980 ? 100 : windowWidth <= 1280 ? 40 : 100}
				data-vertical-height={windowWidth <= 980 ? 100 : windowWidth <= 1280 ? 100 : 100}
				data-lines-color={windowWidth <= 980 ? "dark" : windowWidth <= 1280 ? "light" : "dark"}
				data-left-line-x={0}
				data-left-line-height={0}
				data-right-line-x={100}
				data-right-line-height={0}
			>
				<div ref={screenContentRef} className={`screenContent ${styles.screenContent}`}>
					<div className={styles.leftBlock}>
						<div className={styles.topPart}>
							<div className={styles.phrasesList}>
								{teamList.map((person, index) => (
									<div
										key={index}
										ref={(el) => {
											phrasesRefs.current[index] = el;
										}}
										className={`${styles.phraseItem} ${hoveredIndex === index ? styles.active : ""} ${phrasesTallestIndex === index ? styles.relative : ""}`}
									>
										{person.phrase
											? `«${person.phrase}»`
											: language === "ru"
											? `«Здесь будет какая-то цитата, но мы её ещё не придумали :)»`
											: `There will be some kind of quote, but we haven't come up with it yet :)»`}
									</div>
								))}
							</div>
						</div>
						<div className={styles.bottomPart}>
							<div className={styles.aboutPersonsList}>
								{teamList.map((person, index) => (
									<div
										key={index}
										ref={(el) => {
											aboutPersonRefs.current[index] = el;
										}}
										className={`${styles.aboutPersonItem} 
										${hoveredIndex === index ? styles.active : hoveredIndex !== null && index < hoveredIndex ? styles.prev : ""}
										${aboutPersonTallestIndex === index ? styles.relative : ""}`}
									>
										<div className={styles.personName}>{person.name ? person.name : language === "ru" ? "Имя не указано" : "Name is not specified"}</div>
										<ul className={styles.personDescription}>
											{person.post || person.mail ? (
												<>
													<li className={styles.personPost}>
														{person.post ? person.post : language === "ru" ? "Информация не указана" : "No additional information provided"}
													</li>
													<li className={styles.personMail}>
														{person.mail ? person.mail : language === "ru" ? "Информация не указана" : "No additional information provided"}
													</li>
												</>
											) : (
												<li className={styles.personPost}>{language === "ru" ? "Информация не указана" : "No additional information provided"}</li>
											)}
										</ul>
									</div>
								))}
							</div>

							<LinkWithPreloader href="/about" className={styles.aboutUsButton}>
								<div className={styles.icon} />
								<div className={styles.text}>{language === "ru" ? "Больше о нас" : "More about us"}</div>
							</LinkWithPreloader>
						</div>
					</div>
					<div className={styles.centerBlock}>
						<div className={styles.photosList}>
							{teamList.map((person, index) => (
								<div key={index} className={`${styles.photo} ${hoveredIndex === index ? styles.active : ""}`}>
									<img src={person.photo || "/images/mainPage/screen5/placeholder.png"} alt={person.name || ""} />
								</div>
							))}
						</div>
						{data?.title_background && <div className={`titleBackground ${styles.titleBackground}`}>{data.title_background}</div>}
					</div>
					<div className={styles.rightBlock}>
						<div className={styles.personsList} ref={personsListRef}>
							<div ref={frameRef} className={styles.frame} style={{ transform: `translate(${frameLeft}px, ${frameTop}px)` }}>
								<div className={styles.top} />
								<div className={styles.right} />
								<div className={styles.bottom} />
								<div className={styles.left} />
							</div>

							{teamList.map((person, index) => (
								<div
									key={index}
									ref={(el) => {
										personRefs.current[index] = el;
									}}
									className={`${styles.personItem} ${hoveredIndex === index ? styles.active : ""}`}
									onMouseEnter={() => setHoveredIndex(index)}
								>
									<img src={person.photo || "/images/mainPage/screen5/placeholder.png"} alt={person.name || ""} />
								</div>
							))}

							<div className={styles.more}>
								<LinkWithPreloader href="/about" className={styles.aboutUsButton}>
									<div className={styles.icon} />
									<div className={styles.text}>{language === "ru" ? "Больше о нас" : "More about us"}</div>
								</LinkWithPreloader>
								<div className={styles.moreText}>{language === "ru" ? `ЕЩЕ > 20` : `MORE > 20`}</div>
							</div>
						</div>

						<div className={styles.numbersAndIcons}>
							<div className={styles.numbersBlock}>
								{teamList.map((_, index) => (
									<div key={index} className={`${styles.number} ${hoveredIndex === index ? styles.active : ""}`}>
										({String(index + 1).padStart(2, "0")})
									</div>
								))}
							</div>
							<div className={styles.iconsBlock}>
								{teamList.map((person, index) => (
									<div key={index} className={`${styles.icon} ${hoveredIndex === index ? styles.active : ""}`}>
										<img src={person.icon ? person.icon : `/images/mainPage/screen5/icon${index + 1}.svg`} alt="" />
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
