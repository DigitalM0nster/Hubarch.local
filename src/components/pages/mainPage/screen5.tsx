import styles from "./styles.module.scss";
import { useMainPageStore } from "@/store/mainPageStore";
import { usePreloaderStore } from "@/store/preloaderStore";
import { useEffect, useRef, useState } from "react";
import LinkWithPreloader from "@/components/preloader/LinkWithPreloader";
import { useWindowStore } from "@/store/windowStore";

export default function Screen5({ language }: { language: string }) {
	const { windowWidth, windowHeight } = useWindowStore();

	const data = useMainPageStore((state) => state.data?.main_page_screen5);

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

	// Определяем тип для элементов команды
	type Person = {
		photo: string | false;
		name: string;
		post: string;
		mail: string;
		phrase: string;
		icon: string | false;
	};

	// Используем useRef для создания стабильной ссылки на массив, чтобы предотвратить ненужные перерисовки
	const teamList = useRef<Person[]>([]).current;

	// Обновляем teamList только когда меняется data?.team_list
	useEffect(() => {
		// Получаем актуальные данные
		const sourceData = data?.team_list || [];

		// Очищаем текущий массив
		teamList.length = 0;

		// Заполняем данными из источника
		// Если данных меньше 5, дополняем пустыми объектами
		const maxLength = Math.max(5, sourceData.length);

		for (let i = 0; i < maxLength; i++) {
			const person = sourceData[i] as Partial<Person> | undefined;
			teamList.push({
				photo: person?.photo || false,
				name: person?.name || "",
				post: person?.post || "",
				mail: person?.mail || "",
				phrase: person?.phrase || "",
				icon: person?.icon || false,
			});
		}
	}, [data?.team_list]);

	// Определяем самые высокие блоки
	useEffect(() => {
		// Проверяем наличие ссылок и элементов в массиве
		if (!aboutPersonRefs.current || aboutPersonRefs.current.length === 0) return;
		if (!phrasesRefs.current || phrasesRefs.current.length === 0) return;

		// Вычисляем высоты для блоков с информацией о персонах
		const aboutPersonHeights = aboutPersonRefs.current.map((el) => el?.offsetHeight || 0);
		if (aboutPersonHeights.length === 0 || Math.max(...aboutPersonHeights) === 0) return;

		const aboutPersonMaxHeight = Math.max(...aboutPersonHeights);
		const aboutPersonMaxIndex = aboutPersonHeights.findIndex((h) => h === aboutPersonMaxHeight);

		// Вычисляем высоты для блоков с цитатами
		const phrasesHeights = phrasesRefs.current.map((el) => el?.offsetHeight || 0);
		if (phrasesHeights.length === 0 || Math.max(...phrasesHeights) === 0) return;

		const phrasesMaxHeight = Math.max(...phrasesHeights);
		const phrasesMaxIndex = phrasesHeights.findIndex((h) => h === phrasesMaxHeight);

		setAboutPersonTallestIndex(aboutPersonMaxIndex);
		setPhrasesTallestIndex(phrasesMaxIndex);
	}, [data?.team_list, windowWidth, windowHeight]);

	// Функция для расчета высот и установки индексов самых высоких блоков
	const calculateHeightsAndSetTallest = () => {
		if (aboutPersonRefs.current.length > 0 && phrasesRefs.current.length > 0) {
			// Вычисляем высоты для блоков с информацией о персонах
			const aboutPersonHeights = aboutPersonRefs.current.map((el, i) => {
				const height = el?.offsetHeight || 0;
				return height;
			});

			if (aboutPersonHeights.length > 0 && Math.max(...aboutPersonHeights) > 0) {
				const aboutPersonMaxHeight = Math.max(...aboutPersonHeights);
				const aboutPersonMaxIndex = aboutPersonHeights.findIndex((h) => h === aboutPersonMaxHeight);
				setAboutPersonTallestIndex(aboutPersonMaxIndex);
			}

			// Вычисляем высоты для блоков с цитатами
			const phrasesHeights = phrasesRefs.current.map((el, i) => {
				const height = el?.scrollHeight || 0;
				return height;
			});

			if (phrasesHeights.length > 0 && Math.max(...phrasesHeights) > 0) {
				const phrasesMaxHeight = Math.max(...phrasesHeights);
				const phrasesMaxIndex = phrasesHeights.findIndex((h) => h === phrasesMaxHeight);
				setPhrasesTallestIndex(phrasesMaxIndex);
			}
		}
	};

	// Добавляем эффект, который будет срабатывать после монтирования DOM
	useEffect(() => {
		// Используем setTimeout для гарантии, что DOM полностью отрендерен
		const timeoutId = setTimeout(() => {
			calculateHeightsAndSetTallest();
		}, 500); // Даем время на рендеринг

		return () => clearTimeout(timeoutId);
	}, []);

	// Пересчитываем высоты при изменении размера окна
	useEffect(() => {
		if (aboutPersonRefs.current.length > 0 && phrasesRefs.current.length > 0) {
			// Используем setTimeout, чтобы дать время на перерисовку DOM
			const timeoutId = setTimeout(() => {
				calculateHeightsAndSetTallest();
			}, 100);

			return () => clearTimeout(timeoutId);
		}
	}, [windowWidth, windowHeight]);

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
										data-is-tallest={phrasesTallestIndex === index ? "true" : "false"}
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
										data-is-tallest={aboutPersonTallestIndex === index ? "true" : "false"}
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
								<div className={styles.moreText}>{data?.team_more_text}</div>
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
