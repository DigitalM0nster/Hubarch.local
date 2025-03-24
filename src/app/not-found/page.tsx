import { notFound } from "next/navigation";

export default function NotFoundPage() {
	notFound(); // ⬅️ Триггерит твою not-found.tsx
}
