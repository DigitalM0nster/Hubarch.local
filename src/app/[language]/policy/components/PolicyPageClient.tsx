"use client";

import { useEffect, useState } from "react";
import styles from "./styles.module.css";

// Интерфейс для данных политики
interface PolicyData {
	content: string;
	title: string;
	lastUpdated: string;
}

// Клиентский компонент для отображения политики конфиденциальности
export function PolicyPageClient({ language }: { language: string }) {
	// Состояние для хранения данных политики
	const [policyData, setPolicyData] = useState<PolicyData | null>(null);
	// Состояние для индикатора загрузки
	const [isLoading, setIsLoading] = useState(true);
	// Состояние для ошибок
	const [error, setError] = useState<string | null>(null);

	// Загружаем данные политики при изменении языка
	useEffect(() => {
		const fetchPolicy = async () => {
			try {
				setIsLoading(true);
				setError(null);

				// Вызываем API для получения политики по языку
				const response = await fetch(`/api/policy/${language}`);

				if (!response.ok) {
					throw new Error("Не удалось загрузить политику");
				}

				const data = await response.json();
				setPolicyData(data);
			} catch (err) {
				setError(err instanceof Error ? err.message : "Произошла ошибка");
			} finally {
				setIsLoading(false);
			}
		};

		fetchPolicy();
	}, [language]);

	// Показываем загрузку
	if (isLoading) {
		return (
			<div className={styles.policyContainer}>
				<div className={styles.loadingMessage}>Загрузка политики конфиденциальности...</div>
			</div>
		);
	}

	// Показываем ошибку
	if (error) {
		return (
			<div className={styles.policyContainer}>
				<div className={styles.errorMessage}>Ошибка: {error}</div>
			</div>
		);
	}

	// Показываем содержимое политики
	return (
		<div className={styles.policyContainer}>
			<div className={styles.policyContent}>
				<h1 className={styles.policyTitle}>{policyData?.title}</h1>

				{policyData?.lastUpdated && <div className={styles.lastUpdated}>Последнее обновление: {policyData.lastUpdated}</div>}

				<div className={styles.policyText} dangerouslySetInnerHTML={{ __html: policyData?.content || "" }} />
			</div>
		</div>
	);
}
