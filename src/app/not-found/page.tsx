import { notFound } from "next/navigation";

export default function NotFoundPage() {
	notFound(); // ⬅️ Триггерит not-found.tsx
}
