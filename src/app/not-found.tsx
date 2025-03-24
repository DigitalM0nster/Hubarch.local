// src\app\not-found.tsx

import Preloader404 from "@/components/pages/404page/Preloader404";

export default function NotFound() {
	return (
		<div className="screen active">
			<div className="screenContent">
				<h1>404 — Страница не найдена</h1>
				<p>Попробуйте вернуться на главную</p>
			</div>
			<Preloader404 />
		</div>
	);
}
