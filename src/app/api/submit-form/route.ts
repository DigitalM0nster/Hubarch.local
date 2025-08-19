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
	if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
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
	message += `�� *Имя:* ${data.name}\n`;
	message += `�� *Телефон:* ${data.phone}\n`;

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
		message += `�� *Страница:* ${data.pageUrl}\n`;
	}

	// Добавляем время
	message += `\n⏰ *Время:* ${new Date().toLocaleString("ru-RU", {
		timeZone: "Europe/Moscow",
	})}`;

	// Отправляем сообщение в Telegram
	const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

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
	});

	if (!response.ok) {
		const errorData = await response.json();
		throw new Error(`Telegram API error: ${errorData.description}`);
	}

	return response.json();
}

// POST обработчик для отправки формы
export async function POST(request: NextRequest) {
	try {
		// Получаем данные из запроса
		const body = await request.json();
		const formData: FormData = body;

		// Валидация обязательных полей
		if (!formData.name || !formData.phone) {
			return NextResponse.json({ error: "Имя и телефон обязательны" }, { status: 400 });
		}

		// Добавляем URL страницы
		formData.pageUrl = request.headers.get("referer") || "Неизвестно";

		// Отправляем в Telegram
		await sendTelegramMessage(formData);

		// Возвращаем успешный ответ
		return NextResponse.json(
			{
				success: true,
				message: "Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.",
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error("Error submitting form:", error);

		return NextResponse.json(
			{
				error: "Произошла ошибка при отправке заявки. Попробуйте позже.",
			},
			{ status: 500 }
		);
	}
}
