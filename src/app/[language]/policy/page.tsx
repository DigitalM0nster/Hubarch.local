import { redirect } from "next/navigation";
import { useAllOptionsStore } from "@/store/allOptionsStore";

// Простая страница политики с редиректом на файл из админки
// URL: /ru/policy -> редирект на русский файл из allOptionsStore
// URL: /en/policy -> редирект на английский файл из allOptionsStore
export default async function PolicyPage({ params }: { params: Promise<{ language: string }> }) {
	// Получаем язык из параметров
	const { language } = await params;

	// Получаем данные из store
	const store = useAllOptionsStore.getState();

	// Если данные еще не загружены, загружаем их
	if (!store.privacyPolicyData) {
		await store.fetchAllOptions();
	}

	// Получаем URL файла политики для нужного языка
	const privacyPolicyData = store.privacyPolicyData;

	if (!privacyPolicyData) {
		// Если данные не загрузились, редиректим на главную
		redirect(`/${language}`);
	}

	// Определяем URL файла в зависимости от языка
	let fileUrl: string;

	if (language === "ru") {
		// Редирект на русский файл политики из админки
		fileUrl = privacyPolicyData.privacy_policy.ru;
	} else if (language === "en") {
		// Редирект на английский файл политики из админки
		fileUrl = privacyPolicyData.privacy_policy.en;
	} else {
		// Если язык не поддерживается, редиректим на русский
		fileUrl = privacyPolicyData.privacy_policy.ru;
	}

	// Проверяем, что URL файла существует
	if (!fileUrl) {
		// Если URL файла не найден, редиректим на главную
		redirect(`/${language}/404`);
	}

	// Делаем редирект на файл из админки
	redirect(fileUrl);
}
