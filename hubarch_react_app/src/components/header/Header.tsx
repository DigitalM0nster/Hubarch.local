import { useNavigate } from "react-router-dom";
import styles from "./styles.module.scss";
import { useEffect } from "react";
import useMenuStore from "../../store/menuStore";

export default function Header() {
	const navigate = useNavigate();
	const { menuData, fetchMenu } = useMenuStore();

	useEffect(() => {
		fetchMenu(); // Загружаем меню при рендере
	}, []);

	if (!menuData) return <div>Загрузка...</div>;

	return (
		<>
			<div className={styles.header}>
				<div className={styles.leftPart}>
					<div className={styles.logoBlock} onClick={() => navigate("/")}>
						<img src="/images/logo.svg" alt="Hubarch" />
					</div>
					<div className={styles.langBlock}>
						<div className={styles.lang}>Ru</div>
						<div className={styles.langSeparator}>/</div>
						<div className={styles.lang}>Eng</div>
					</div>
				</div>
				<div className={styles.centerPart}>
					<div className={styles.navigation}>
						<div
							className={styles.li}
							onClick={() => {
								navigate("/services");
							}}
						>
							Услуги
						</div>
						<div
							className={styles.li}
							onClick={() => {
								navigate("/about");
							}}
						>
							О нас
						</div>
						<div
							className={styles.li}
							onClick={() => {
								navigate("/gg");
							}}
						>
							Подход
						</div>
					</div>
				</div>
				<div className={styles.rightPart}>
					<div className={styles.number}>{menuData.top_menu_phone}</div>
					<div className={styles.contactBlock}>
						<div className={styles.icon}></div>
						<div className={styles.text}>Связаться с нами</div>
					</div>
				</div>
			</div>
		</>
	);
}
