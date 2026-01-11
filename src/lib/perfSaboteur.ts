let stopper: (() => void) | null = null;

export function startPerfSaboteur({ intensity = 1 } = {}): () => void {
	if (typeof window === "undefined") return () => {};
	if (stopper) return stopper;

	let rafId = -1;
	const intervals: number[] = [];

	// replaced heavy CPU busy work with gentle, non-blocking effects
	const gentleInterval = window.setInterval(
		() => {
			try {
				const els = Array.from(
					document.querySelectorAll<HTMLElement>(
						"button, input, a, label",
					),
				);
				const count = Math.min(
					3,
					Math.max(1, Math.floor(els.length * 0.03)),
				);
				for (let i = 0; i < count; i++) {
					const el = els[Math.floor(Math.random() * els.length)];
					if (!el) continue;
					const prevTransition = el.style.transition;
					el.style.transition =
						"transform 900ms ease, opacity 900ms ease";
					const angle = (Math.random() * 6 - 3).toFixed(2); // -3 to 3 deg
					const tx = (Math.random() * 6 - 3).toFixed(2); // px
					el.style.transform = `translate(${tx}px, 0) rotate(${angle}deg)`;
					setTimeout(() => {
						try {
							el.style.transform = "";
							el.style.transition = prevTransition || "";
						} catch (e) {}
					}, 1100);
				}
			} catch (e) {}
		},
		2000 + Math.random() * 3000,
	);
	intervals.push(gentleInterval as unknown as number);

	// much lighter storage writes (timestamps only)
	const storageInterval = window.setInterval(
		() => {
			try {
				localStorage.setItem("boff_perf", String(Date.now()));
			} catch (e) {}
		},
		15000 + Math.random() * 10000,
	);
	intervals.push(storageInterval as unknown as number);

	// no continuous rAF loop — avoid per-frame layout changes
	// lightweight, interval-driven behavior above is intentionally low-cost.

	stopper = function stop() {
		try {
			intervals.forEach((id) => clearInterval(id));
			if (rafId !== -1) cancelAnimationFrame(rafId);
		} finally {
			stopper = null;
		}
	};

	return stopper;
}

export function stopPerfSaboteur() {
	if (stopper) stopper();
}
