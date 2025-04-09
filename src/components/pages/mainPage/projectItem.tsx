import styles from "./styles.module.scss";
import LinkWithPreloader from "@/components/preloader/LinkWithPreloader";
import { useInteractiveLinesStore } from "@/store/interactiveLinesStore";
import { useWindowStore } from "@/store/windowStore";
import Image from "next/image";

interface ProjectItemProps {
	language: string;
	project?: {
		id: number;
		title: {
			rendered: string;
		};
		acf: {
			project_preview: string;
		};
		slug: string;
	};
	index: number;
}

export default function ProjectItem({ language, project, index }: ProjectItemProps) {
	const { verticalLine, miniLine } = useInteractiveLinesStore();
	const { isMobile } = useWindowStore();

	function updateVerticalLine(i: number) {
		const container = document.querySelector(`.${styles.projectsContainer}`) as HTMLElement;
		if (!container) return;

		const widths = [25, 25, 25, 25];
		widths[i] = 30;
		const total = widths.reduce((sum, w) => sum + w, 0);
		const pixelPerPercent = container.offsetWidth / total;

		let left = 0;
		for (let j = 0; j < i; j++) {
			left += widths[j] * pixelPerPercent;
		}
		const center = left + (widths[i] * pixelPerPercent) / 2;
		const percentX = (center / container.offsetWidth) * 100;

		verticalLine.setNewX(percentX);
	}

	if (!project) {
		return (
			<div
				className={`${styles.projectItem} ${styles.noProject}`}
				onMouseEnter={() => {
					if (!isMobile) {
						updateVerticalLine(index);
						miniLine.setNewRotation(45 + index * 90);
					}
				}}
			>
				<div className={styles.image}>
					{index === 0 && <img src="/images/mainPage/screen3/project1.png" alt="" width={1550} height={1100} />}
					{index === 1 && <img src="/images/mainPage/screen3/project2.png" alt="" width={1550} height={1100} />}
					{index === 2 && <img src="/images/mainPage/screen3/project3.png" alt="" width={1550} height={1100} />}
					{index === 3 && <img src="/images/mainPage/screen3/project4.png" alt="" width={1550} height={1100} />}
				</div>
				<div className={styles.projectName}>{language === "ru" ? "Скоро появится.." : "Coming soon.."}</div>
			</div>
		);
	}

	const { id, title, acf } = project;

	return (
		<LinkWithPreloader
			key={id}
			href={`/${language}/projects/${project.slug}`}
			className={styles.projectItem}
			customMouseEnter={() => {
				if (!isMobile) {
					updateVerticalLine(index);
					miniLine.setNewRotation(45 + index * 90);
				}
			}}
		>
			<div className={styles.image}>
				<img src={acf.project_preview} alt={title.rendered} />
			</div>
			<div className={styles.projectName}>{title.rendered}</div>
		</LinkWithPreloader>
	);
}
