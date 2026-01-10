export function attachFlee(
	el: HTMLElement,
	options: { distance?: number; step?: number } = { distance: 120, step: 80 },
) {
	const handler = (e: PointerEvent) => {
		const r = el.getBoundingClientRect();
		const cx = r.left + r.width / 2,
			cy = r.top + r.height / 2;
		const dx = e.clientX - cx,
			dy = e.clientY - cy;
		const dist = Math.hypot(dx, dy);
		if (dist < (options.distance || 120)) {
			const angle = Math.atan2(dy, dx);
			const nx = Math.cos(angle) * -(options.step || 80);
			const ny = Math.sin(angle) * -(options.step || 80);
			el.style.transform = `translate(${nx}px, ${ny}px)`;
			el.dataset.fled = "1";
			setTimeout(
				() => (el.style.transform = ""),
				700 + Math.random() * 800,
			);
		}
	};
	document.addEventListener("pointermove", handler);
	return () => document.removeEventListener("pointermove", handler);
}
