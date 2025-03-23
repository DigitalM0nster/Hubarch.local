import { useEffect, useState } from "react";

let global = {
	total: 0,
	done: 0,
	components: new Set<string>(),
	callbacks: [] as ((progress: number) => void)[],
	onComplete: [] as (() => void)[],
	isCompleted: false,
};

export function registerAsyncTask() {
	global.total += 1;
	triggerUpdate();
}

export function completeAsyncTask() {
	global.done += 1;
	triggerUpdate();
	checkComplete();
}

export function registerComponentReady(id: string) {
	if (!global.components.has(id)) {
		global.total += 1;
		global.components.add(id);
		triggerUpdate();
	}
}

export function completeComponentReady(id: string) {
	if (global.components.has(id)) {
		global.done += 1;
		global.components.delete(id);
		triggerUpdate();
		checkComplete();
	}
}

function checkComplete() {
	if (!global.isCompleted && global.done >= global.total) {
		global.isCompleted = true;
		global.onComplete.forEach((cb) => cb());
	}
}

function triggerUpdate() {
	const progress = global.total === 0 ? 100 : Math.floor((global.done / global.total) * 100);
	global.callbacks.forEach((cb) => cb(progress));
}

export function useFullPreloader() {
	const [progress, setProgress] = useState(0);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		global.callbacks.push(setProgress);
		global.onComplete.push(() => setLoading(false));

		// Найдём все изображения в DOM
		const images = Array.from(document.querySelectorAll("img"));
		console.log(images);
		const unloaded = images.filter((img) => !img.complete);

		if (unloaded.length > 0) {
			global.total += unloaded.length;
			unloaded.forEach((img) => {
				const onFinish = () => {
					img.removeEventListener("load", onFinish);
					img.removeEventListener("error", onFinish);
					global.done += 1;
					triggerUpdate();
					checkComplete();
				};
				img.addEventListener("load", onFinish);
				img.addEventListener("error", onFinish);
			});
			triggerUpdate();
		}

		return () => {
			// Очистка подписчиков
			global.callbacks = global.callbacks.filter((cb) => cb !== setProgress);
			global.onComplete = global.onComplete.filter((cb) => cb !== setLoading);
		};
	}, []);

	return { loading, progress };
}
