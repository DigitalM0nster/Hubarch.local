// src/app/api/submit-form/route.ts
import { NextRequest, NextResponse } from "next/server";

// Конфигурация Telegram бота
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

// Интерфейс для данных формы
interface FormData {
	name: string;
	phone: string;
	email?: string;
	message?: string;
	footage?: string;
	formType?: "contact" | "application" | "testfit";
	pageUrl?: string;
}

// Функция для отправки сообщения в Telegram
async function sendTelegramMessage(data: FormData) {
	console.log("🔍 Debug: Starting sendTelegramMessage");
	console.log("🔍 Debug: TELEGRAM_BOT_TOKEN exists:", !!TELEGRAM_BOT_TOKEN);
	console.log("🔍 Debug: TELEGRAM_CHAT_ID exists:", !!TELEGRAM_CHAT_ID);
	console.log("🔍 Debug: TELEGRAM_CHAT_ID value:", TELEGRAM_CHAT_ID);

	if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
		console.error("❌ Error: Telegram bot configuration is missing");
		throw new Error("Telegram bot configuration is missing");
	}

	// Формируем сообщение
	let message = `🎯 *Новая заявка с сайта Hubarch*\n\n`;

	// Определяем тип формы по контексту
	let formType = data.formType || "application";
	if (data.footage) {
		formType = "testfit";
	}

	// Добавляем тип формы
	switch (formType) {
		case "contact":
			message += `📞 *Тип:* Контактная форма\n`;
			break;
		case "application":
			message += `📋 *Тип:* Заявка на проект\n`;
			break;
		case "testfit":
			message += `📐 *Тип:* Тест-фит\n`;
			break;
	}

	// Основная информация
	message += `👤 *Имя:* ${data.name}\n`;
	message += `📱 *Телефон:* ${data.phone}\n`;

	if (data.email) {
		message += `📧 *Email:* ${data.email}\n`;
	}

	if (data.footage) {
		message += `📏 *Площадь:* ${data.footage}\n`;
	}

	if (data.message) {
		message += `💬 *Сообщение:* ${data.message}\n`;
	}

	// Добавляем URL страницы
	if (data.pageUrl) {
		message += `🌐 *Страница:* ${data.pageUrl}\n`;
	}

	// Добавляем время
	message += `\n⏰ *Время:* ${new Date().toLocaleString("ru-RU", {
		timeZone: "Europe/Moscow",
	})}`;

	// Отправляем сообщение в Telegram
	const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

	console.log("🔍 Debug: Sending to Telegram URL:", telegramUrl);

	// Используем более стабильный способ отправки запроса
	const response = await fetch(telegramUrl, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			chat_id: TELEGRAM_CHAT_ID,
			text: message,
			parse_mode: "Markdown",
		}),
		// Убираем проблемные настройки
	});

	console.log("🔍 Debug: Telegram response status:", response.status);

	if (!response.ok) {
		const errorText = await response.text();
		console.error("❌ Telegram API error:", errorText);
		throw new Error(`Telegram API error: ${response.status} ${errorText}`);
	}

	const result = await response.json();
	console.log("✅ Debug: Telegram response success:", result);
	return result;
}

// POST обработчик для отправки формы
export async function POST(request: NextRequest) {
	console.log("🔍 Debug: API route called");

	try {
		// Получаем данные из запроса - используем более безопасный способ
		let body;
		try {
			body = await request.json();
		} catch (parseError) {
			console.error("❌ Error parsing request body:", parseError);
			return NextResponse.json({ error: "Неверный формат данных" }, { status: 400 });
		}

		const formData: FormData = body;

		console.log("🔍 Debug: Received form data:", formData);

		// Валидация обязательных полей
		if (!formData.name || !formData.phone) {
			return NextResponse.json({ error: "Имя и телефон обязательны" }, { status: 400 });
		}

		// Добавляем URL страницы - используем более безопасный способ
		const referer = request.headers.get("referer");
		formData.pageUrl = referer || "Неизвестно";
		console.log("🔍 Debug: Page URL:", formData.pageUrl);

		// Отправляем в Telegram
		await sendTelegramMessage(formData);

		console.log("✅ Debug: Form submitted successfully");

		// Возвращаем успешный ответ
		return NextResponse.json(
			{
				success: true,
				message: "Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.",
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error("❌ Error submitting form:", error);

		// Более детальная обработка ошибок
		let errorMessage = "Произошла ошибка при отправке заявки. Попробуйте позже.";

		if (error instanceof Error) {
			if (error.message.includes("Telegram bot configuration is missing")) {
				errorMessage = "Ошибка конфигурации бота. Обратитесь к администратору.";
			} else if (error.message.includes("Telegram API error")) {
				errorMessage = "Ошибка отправки в Telegram. Попробуйте позже.";
			}
		}

		return NextResponse.json(
			{
				error: errorMessage,
			},
			{ status: 500 }
		);
	}
}
