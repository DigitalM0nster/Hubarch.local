import { PolicyPageClient } from "./components/PolicyPageClient";

// Страница политики конфиденциальности
// Принимает параметр language из URL (ru/en)
export default function PolicyPage({ params }: { params: { language: string } }) {
	return <PolicyPageClient language={params.language} />;
}
