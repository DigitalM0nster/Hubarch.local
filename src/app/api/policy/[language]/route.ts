import { NextRequest, NextResponse } from "next/server";

// Кэш для политики (в продакшене лучше использовать Redis или подобное)
const policyCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 минут

// Fallback данные если файл не найден в админке
const fallbackPolicies = {
	ru: {
		title: "Политика конфиденциальности",
		content: `
      <h2>1. Общие положения</h2>
      <p>Настоящая политика конфиденциальности описывает, как мы собираем, используем и защищаем вашу личную информацию.</p>
      
      <h2>2. Сбор информации</h2>
      <p>Мы собираем только ту информацию, которая необходима для предоставления наших услуг.</p>
      
      <h2>3. Использование информации</h2>
      <p>Собранная информация используется исключительно для улучшения качества наших услуг.</p>
      
      <h2>4. Защита информации</h2>
      <p>Мы принимаем все необходимые меры для защиты вашей личной информации.</p>
      
      <p><em>Примечание: Это базовая версия политики. Для получения актуальной версии обратитесь к администратору.</em></p>
    `,
		lastUpdated: new Date().toISOString().split("T")[0],
	},
	en: {
		title: "Privacy Policy",
		content: `
      <h2>1. General Provisions</h2>
      <p>This privacy policy describes how we collect, use and protect your personal information.</p>
      
      <h2>2. Information Collection</h2>
      <p>We collect only the information necessary to provide our services.</p>
      
      <h2>3. Information Usage</h2>
      <p>The collected information is used exclusively to improve the quality of our services.</p>
      
      <h2>4. Information Protection</h2>
      <p>We take all necessary measures to protect your personal information.</p>
      
      <p><em>Note: This is a basic version of the policy. For the current version, please contact the administrator.</em></p>
    `,
		lastUpdated: new Date().toISOString().split("T")[0],
	},
};

// API endpoint для получения политики конфиденциальности
export async function GET(request: NextRequest, { params }: { params: Promise<{ language: string }> }) {
	try {
		// Получаем параметры из Promise (Next.js 15)
		const { language } = await params;

		// Проверяем, что язык поддерживается
		if (!["ru", "en"].includes(language)) {
			return NextResponse.json(
				{
					error: "Неподдерживаемый язык. Поддерживаются только 'ru' и 'en'",
					supportedLanguages: ["ru", "en"],
				},
				{ status: 400 }
			);
		}

		// Проверяем кэш
		const cacheKey = `policy_${language}`;
		const cached = policyCache.get(cacheKey);

		if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
			// Возвращаем данные из кэша
			return NextResponse.json(cached.data, {
				headers: {
					"X-Cache": "HIT",
					"Cache-Control": "public, max-age=300", // 5 минут для браузера
				},
			});
		}

		// TODO: Здесь должна быть логика получения файла из админки
		// 1. Подключение к базе данных
		// 2. Поиск файла политики по языку (language)
		// 3. Чтение содержимого файла
		// 4. Возврат данных в формате:
		// {
		//   title: "Заголовок политики",
		//   content: "HTML содержимое файла",
		//   lastUpdated: "2024-01-15"
		// }

		// Пока что используем fallback данные
		const policyData = fallbackPolicies[language as keyof typeof fallbackPolicies];

		// Сохраняем в кэш
		policyCache.set(cacheKey, {
			data: policyData,
			timestamp: Date.now(),
		});

		// Возвращаем данные с заголовками кэширования
		return NextResponse.json(policyData, {
			headers: {
				"X-Cache": "MISS",
				"Cache-Control": "public, max-age=300",
				"Last-Modified": new Date().toISOString(),
			},
		});
	} catch (error) {
		console.error("Ошибка при получении политики:", error);

		// Возвращаем fallback данные при ошибке
		try {
			const { language } = await params;
			const fallbackData = fallbackPolicies[language as keyof typeof fallbackPolicies];

			if (fallbackData) {
				return NextResponse.json(fallbackData, {
					status: 200,
					headers: {
						"X-Cache": "FALLBACK",
						"Cache-Control": "public, max-age=60", // 1 минута для fallback
					},
				});
			}
		} catch (fallbackError) {
			console.error("Ошибка при получении fallback данных:", fallbackError);
		}

		return NextResponse.json(
			{
				error: "Не удалось загрузить политику конфиденциальности",
				fallback: "Попробуйте обновить страницу или обратитесь к администратору",
			},
			{ status: 500 }
		);
	}
}
