"use client";

import { useEffect, useState, useCallback } from "react";
import styles from "./styles.module.css";

// Интерфейс для данных политики
interface PolicyData {
	content: string;
	title: string;
	lastUpdated: string;
}

// Интерфейс для ошибки API
interface ApiError {
	error: string;
	fallback?: string;
	supportedLanguages?: string[];
}

// Клиентский компонент для отображения политики конфиденциальности
export default function PolicyPageClient({ language }: { language: string }) {
	// Состояние для хранения данных политики
	const [policyData, setPolicyData] = useState<PolicyData | null>(null);
	// Состояние для индикатора загрузки
	const [isLoading, setIsLoading] = useState(true);
	// Состояние для ошибок
	const [error, setError] = useState<ApiError | null>(null);
	// Состояние для индикатора кэша
	const [cacheStatus, setCacheStatus] = useState<string>("");

	// Функция загрузки политики с повторными попытками
	const fetchPolicy = useCallback(
		async (retryCount = 0) => {
			try {
				setIsLoading(true);
				setError(null);
				setCacheStatus("");

				// Вызываем API для получения политики по языку
				const response = await fetch(`/api/policy/${language}`, {
					// Добавляем заголовки для лучшего кэширования
					headers: {
						"Cache-Control": "max-age=300",
					},
				});

				// Получаем статус кэша из заголовков
				const cacheStatusHeader = response.headers.get("X-Cache");
				if (cacheStatusHeader) {
					setCacheStatus(cacheStatusHeader);
				}

				if (!response.ok) {
					const errorData: ApiError = await response.json();
					throw new Error(errorData.error || `HTTP ${response.status}`);
				}

				const data: PolicyData = await response.json();
				setPolicyData(data);
			} catch (err) {
				const errorMessage = err instanceof Error ? err.message : "Произошла ошибка";

				// Если это первая попытка, пробуем еще раз
				if (retryCount < 2) {
					setTimeout(() => fetchPolicy(retryCount + 1), 1000 * (retryCount + 1));
					return;
				}

				setError({
					error: errorMessage,
					fallback: "Попробуйте обновить страницу или обратитесь к администратору",
				});
			} finally {
				setIsLoading(false);
			}
		},
		[language]
	);

	// Загружаем данные политики при изменении языка
	useEffect(() => {
		fetchPolicy();
	}, [fetchPolicy]);

	// Показываем загрузку
	if (isLoading) {
		return (
			<div className={styles.policyContainer}>
				<div className={styles.loadingMessage}>
					<div className={styles.loadingSpinner}></div>
					Загрузка политики конфиденциальности...
				</div>
			</div>
		);
	}

	// Показываем ошибку
	if (error) {
		return (
			<div className={styles.policyContainer}>
				<div className={styles.errorMessage}>
					<h3>Ошибка загрузки</h3>
					<p>{error.error}</p>
					{error.fallback && <p className={styles.errorFallback}>{error.fallback}</p>}
					{error.supportedLanguages && (
						<div className={styles.supportedLanguages}>
							<p>Поддерживаемые языки: {error.supportedLanguages.join(", ")}</p>
						</div>
					)}
					<button className={styles.retryButton} onClick={() => fetchPolicy()}>
						Попробовать снова
					</button>
				</div>
			</div>
		);
	}

	// Показываем содержимое политики
	return (
		<div className={styles.policyContainer}>
			{/* Индикатор кэша */}
			{cacheStatus && (
				<div className={styles.cacheIndicator}>
					{cacheStatus === "HIT" && "📦 Загружено из кэша"}
					{cacheStatus === "MISS" && "🔄 Загружено с сервера"}
					{cacheStatus === "FALLBACK" && "⚠️ Загружена базовая версия"}
				</div>
			)}

			<div className={styles.policyContent}>
				<h1 className={styles.policyTitle}>{policyData?.title}</h1>

				{policyData?.lastUpdated && <div className={styles.lastUpdated}>Последнее обновление: {policyData.lastUpdated}</div>}

				<div className={styles.policyText} dangerouslySetInnerHTML={{ __html: policyData?.content || "" }} />
			</div>
		</div>
	);
}
