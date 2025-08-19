import { NextRequest, NextResponse } from "next/server";

// API endpoint для получения политики конфиденциальности
// GET /api/policy/[language] - возвращает политику на указанном языке
export async function GET(request: NextRequest, { params }: { params: { language: string } }) {
	try {
		const { language } = params;

		// Проверяем, что язык поддерживается
		if (!["ru", "en"].includes(language)) {
			return NextResponse.json({ error: "Неподдерживаемый язык" }, { status: 400 });
		}

		// Здесь должна быть логика получения файла из админки
		// Пока что возвращаем заглушку для демонстрации

		// В реальном проекте здесь будет:
		// 1. Подключение к базе данных
		// 2. Поиск файла политики по языку
		// 3. Чтение содержимого файла
		// 4. Возврат данных

		const mockPolicyData = {
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
        `,
				lastUpdated: "2024-01-15",
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
        `,
				lastUpdated: "2024-01-15",
			},
		};

		// Возвращаем политику для указанного языка
		const policyData = mockPolicyData[language as keyof typeof mockPolicyData];

		if (!policyData) {
			return NextResponse.json({ error: "Политика для данного языка не найдена" }, { status: 404 });
		}

		// Возвращаем данные в формате JSON
		return NextResponse.json(policyData);
	} catch (error) {
		console.error("Ошибка при получении политики:", error);

		return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 });
	}
}
