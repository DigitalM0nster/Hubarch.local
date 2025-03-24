(function () {
	const el = document.querySelector(".preloader .number");
	if (!el) return;

	const container = el.closest(".preloader");
	if (!container) return;

	let current = 0;
	let target = 0;
	const max = 19;

	let rafId;
	let intervalId;

	// медленное обновление цели
	intervalId = setInterval(() => {
		if (target < max) {
			target += Math.floor(Math.random() * 3) + 1;
			if (target > max) target = max;
		}
	}, 600);

	// флаг — прервано или нет
	let stopped = false;

	function animate() {
		if (stopped) {
			return;
		}

		const step = (target - current) / 15;
		current += step;

		// теперь округляем вверх, чтобы гарантировать достижение 19
		const display = Math.min(Math.ceil(current), max);

		el.innerText = display + "%";
		window.__initialProgress = display;
		rafId = requestAnimationFrame(animate);
	}
	animate();

	// отслеживаем, когда React начал рисовать 20+
	const observer = new MutationObserver(() => {
		const val = parseInt(el.innerText);
		if (val >= 19 || container.dataset.status === "activated") {
			clearInterval(intervalId);
			cancelAnimationFrame(rafId);
			observer.disconnect();
			stopped = true;
		}
	});
	observer.observe(el, { childList: true, subtree: true });
})();
