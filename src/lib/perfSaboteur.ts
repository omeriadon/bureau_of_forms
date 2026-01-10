let stopper: (() => void) | null = null;

export function startPerfSaboteur({ intensity = 1 } = {}): () => void {
	if (typeof window === "undefined") return () => {};
	if (stopper) return stopper;

	let rafId = -1;
	const intervals: number[] = [];

	const cpuInterval = window.setInterval(
		() => {
			const start = Date.now();
			const duration = 250 + Math.floor(700 * intensity);
			while (Date.now() - start < duration) {
				const arr = new Array(2000);
				for (let i = 0; i < arr.length; i++) arr[i] = Math.random();
				JSON.stringify(arr);
				Math.sqrt(Math.random() * Date.now());
			}
		},
		Math.max(300, 800 - intensity * 200),
	);
	intervals.push(cpuInterval);

	const thrashAnchor = document.createElement("div");
	thrashAnchor.style.position = "fixed";
	thrashAnchor.style.left = "0";
	thrashAnchor.style.top = "0";
	thrashAnchor.style.width = "1px";
	thrashAnchor.style.height = "1px";
	thrashAnchor.style.opacity = "0";
	document.body.appendChild(thrashAnchor);

	const layoutInterval = window.setInterval(
		() => {
			try {
				const iterations = Math.max(6, Math.floor(12 * intensity));
				for (let i = 0; i < iterations; i++) {
					const n = document.createElement("div");
					n.style.width = `${Math.random() * 80}px`;
					n.style.height = `${Math.random() * 80}px`;
					n.style.position = "absolute";
					n.style.left = `${Math.random() * window.innerWidth}px`;
					n.style.top = `${Math.random() * window.innerHeight}px`;
					n.style.background = `rgba(255,0,0,${0.02 + Math.random() * 0.06})`;
					document.body.appendChild(n);

					void n.offsetHeight;
					n.remove();
				}
				void thrashAnchor.offsetHeight;
			} catch (e) {}
		},
		600 + Math.random() * 400,
	);
	intervals.push(layoutInterval as unknown as number);

	const storageInterval = window.setInterval(
		() => {
			try {
				const big = new Array(800)
					.fill(0)
					.map(() => Math.random().toString(36).repeat(4));
				localStorage.setItem("boff_perf", JSON.stringify(big));
				localStorage.getItem("boff_perf");
			} catch (e) {}
		},
		500 + Math.random() * 500,
	);
	intervals.push(storageInterval as unknown as number);

	(function rafLoop() {
		try {
			const els = document.querySelectorAll<HTMLElement>(
				"button, input, a, label",
			);
			const t = Date.now();
			els.forEach((el, i) => {
				el.style.transform = `translateX(${Math.sin(t / (40 + i) + i) * (1 + intensity * 2)}px)`;
			});
		} catch (e) {}
		rafId = requestAnimationFrame(rafLoop);
	})();

	stopper = function stop() {
		try {
			intervals.forEach((id) => clearInterval(id));
			if (rafId !== -1) cancelAnimationFrame(rafId);
			try {
				thrashAnchor.remove();
			} catch (e) {}
		} finally {
			stopper = null;
		}
	};

	return stopper;
}

export function stopPerfSaboteur() {
	if (stopper) stopper();
}
