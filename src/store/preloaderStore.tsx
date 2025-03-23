// src/store/preloaderStore.ts

type PreloaderStore = {
	componentsToWait: number;
	markedReady: number;
	setTotal: (n: number) => void;
	markReady: () => void;
	onAllReady: (() => void) | null;
	setCallback: (cb: () => void) => void;
	setResetCallback: (cb: () => Promise<void>) => void;
	triggerReset: () => Promise<void>;
};

let resetCallback: (() => Promise<void>) | null = null;

export const preloaderStore: PreloaderStore = {
	componentsToWait: 0,
	markedReady: 0,
	onAllReady: null,
	setTotal(n) {
		this.componentsToWait = n;
	},
	markReady() {
		this.markedReady++;
		if (this.markedReady === this.componentsToWait && this.onAllReady) {
			this.onAllReady();
		}
	},
	setCallback(cb) {
		this.onAllReady = cb;
	},
	setResetCallback(cb: () => Promise<void>) {
		resetCallback = cb;
	},
	async triggerReset() {
		if (resetCallback) {
			await resetCallback();
		}
	},
};
