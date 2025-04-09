import styles from "./styles.module.scss";
import { useMainPageStore } from "@/store/mainPageStore";
import { usePreloaderStore } from "@/store/preloaderStore";
import { useWindowStore } from "@/store/windowStore";
import Image from "next/image";
import { useEffect, useState, useRef, useMemo } from "react";

export default function Screen2() {
	const { markReady } = usePreloaderStore();
	const { isMobile } = useWindowStore();

	const data = useMainPageStore((state) => state.data?.main_page_screen2);
	const { mainPageFetchingFinished } = useMainPageStore();
	const initialNumber = data?.number ? String(data.number) : "200256";
	const initialLength = useMemo(() => initialNumber.length, [initialNumber]);

	const [currentNumber, setCurrentNumber] = useState(parseInt(initialNumber));
	const [digits, setDigits] = useState<string[]>(initialNumber.split(""));
	const digitRefs = useRef<(HTMLDivElement | null)[][]>([]);

	// ОТМЕЧАЕМСЯ ДЛЯ ПРЕЛОАДЕРА

	/* eslint-disable react-hooks/exhaustive-deps */
	useEffect(() => {
		if (mainPageFetchingFinished) {
			markReady();
		}
	}, [mainPageFetchingFinished]);
	/* eslint-enable react-hooks/exhaustive-deps */

	// Определяем группы в зависимости от длины числа
	const getGroupClasses = (length: number) => {
		if (length > 6) return [styles.billion, styles.million, styles.thousand]; // 1 000 000 000+
		if (length > 3) return [styles.million, styles.thousand, styles.hundred]; // 1 000 000 - 999 999
		return [styles.thousand, styles.hundred]; // 1 - 999 999
	};

	// Обновляем активные цифры
	useEffect(() => {
		const newDigits = currentNumber.toString().padStart(initialLength, "0").split("");

		newDigits.forEach((digit, i) => {
			const activeIndex = parseInt(digit);

			if (digitRefs.current[i]) {
				digitRefs.current[i].forEach((el, index) => {
					if (el) {
						if (index === activeIndex) {
							el.classList.add(styles.active);
						} else {
							el.classList.remove(styles.active);
						}
					}
				});
			}
		});

		setDigits(newDigits);
	}, [currentNumber, initialLength]);

	// Увеличиваем число каждую секунду
	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentNumber((prev) => prev + 1);
		}, 1000);

		return () => clearInterval(interval);
	}, []);

	// Формируем блоки чисел, правильно распределяя группы
	const formatBlocks = (digits: string[]) => {
		const length = digits.length;
		const groupClasses = getGroupClasses(length);
		const groups = [];

		const remainingDigits = [...digits]; // Копия массива цифр
		for (let i = groupClasses.length - 1; i >= 0; i--) {
			const groupSize = i === 0 ? remainingDigits.length : 3; // Последняя группа может быть меньше 3
			const range = remainingDigits.splice(-groupSize, groupSize); // Берем цифры с конца, а не с начала

			groups.unshift({ className: groupClasses[i], range }); // Добавляем группы в начало списка
		}

		return groups
			.filter((group) => group.range.length > 0)
			.map((group, index) => {
				return (
					<div key={`${group.className}-numbers${index}`} className={`${styles.numbers} ${group.className}`}>
						{group.range.map((digit, i) => {
							const globalIndex = index * 3 + i;

							return (
								<div key={i} className={styles.number}>
									{[...Array(10)].map((_, num) => (
										<div
											key={num}
											className={`${styles.digit} ${num === parseInt(digit) ? styles.active : ""}`}
											ref={(el) => {
												if (!digitRefs.current[globalIndex]) {
													digitRefs.current[globalIndex] = [];
												}
												digitRefs.current[globalIndex][num] = el;
											}}
										>
											{num}
										</div>
									))}
								</div>
							);
						})}
					</div>
				);
			});
	};

	return (
		<>
			<div
				className={`screen ${styles.screen2}`}
				data-screen-lightness="light"
				data-lines-index={isMobile ? 1 : 1}
				data-mini-line-rotation={45}
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
					<div className={styles.numbersBlock}>
						{formatBlocks(digits)}
						<div className={styles.meter}>
							<div className={styles.letter}>M</div>
							<div className={styles.squareNumber}>2</div>
						</div>
					</div>
					{data?.text && (
						<div className={styles.textBlock}>
							{(data.text.text1 || data.text.text2) && (
								<span className={styles.text}>
									{data.text.text1 && data.text.text1}
									{data.text.text2 && <br />}
									{data.text.text2 && <span className={`${styles.specialText}`}>{data.text.text2}</span>}
									{data.text.text2 && <img src="/images/mainPage/screen2/planetIcon.svg" alt="" width={100} height={100} />}
								</span>
							)}
						</div>
					)}
				</div>
			</div>
		</>
	);
}
