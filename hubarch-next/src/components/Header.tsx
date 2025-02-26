import styles from "./styles.module.scss";

export default function Header() {
	return (
		<>
			<div className={styles.header}>
				<div className={styles.leftPart}>
					<div className={styles.logoBlock}>
						<img src="/images/logo.svg" alt="Hubarch" />
					</div>
				</div>
				<div className={styles.centerPart}>
					<div className={styles.navigation}>
						<div className={styles.li}>Услуги</div>
						<div className={styles.li}>Проекты</div>
					</div>
				</div>
				<div className={styles.rightPart}>
					<div className={styles.number}>8800</div>
				</div>
			</div>
		</>
	);
}
