type Stopper = () => void;

function rand(min: number, max: number) {
	return Math.random() * (max - min) + min;
}

export function startTypographySaboteur({ freq = 1800 } = {}): Stopper {
	if (typeof window === "undefined") return () => {};

	const modified = new Map<HTMLElement, Partial<CSSStyleDeclaration>>();

	function applyOne(el: HTMLElement) {
		try {
			if (!(el instanceof HTMLElement)) return;
			const prev: Partial<CSSStyleDeclaration> = {};

			[
				"fontSize",
				"letterSpacing",
				"wordSpacing",
				"lineHeight",
				"transform",
				"textShadow",
				"filter",
				"writingMode",
				"textOrientation",
				"fontFamily",
				"textDecoration",
			].forEach((k) => {
				(prev as any)[k] = (el.style as any)[k];
			});

			const fontIdx = 1 + Math.floor(Math.random() * 7);
			(el as HTMLElement).classList.remove(
				"font-salad-1",
				"font-salad-2",
				"font-salad-3",
				"font-salad-4",
				"font-salad-5",
				"font-salad-6",
				"font-salad-7",
			);
			(el as HTMLElement).classList.add(`font-salad-${fontIdx}`);

			if (Math.random() < 0.2) {
				(el.style as any).fontSize = `${Math.round(rand(9, 42))}px`;
			} else if (Math.random() < 0.4) {
				(el.style as any).fontSize = `${rand(0.6, 2.6).toFixed(2)}rem`;
			} else {
				(el.style as any).fontSize = `${Math.round(rand(70, 150))}%`;
			}

			(el.style as any).letterSpacing = `${rand(-0.6, 3).toFixed(2)}px`;
			(el.style as any).wordSpacing = `${rand(-2, 10).toFixed(1)}px`;
			(el.style as any).lineHeight = `${rand(0.8, 1.8).toFixed(2)}`;

			if (Math.random() < 0.3)
				(el.style as any).writingMode =
					Math.random() < 0.5 ? "vertical-rl" : "horizontal-tb";
			if (Math.random() < 0.18)
				(el.style as any).textOrientation = "upright" as any;
			if (Math.random() < 0.25)
				(el.style as any).textDecoration =
					Math.random() < 0.5
						? "underline wavy red"
						: "line-through solid var(--accent)";
			if (Math.random() < 0.25)
				(el.style as any).textShadow =
					`0 ${Math.round(rand(1, 6))}px ${Math.round(rand(2, 14))}px rgba(0,0,0,${rand(0.06, 0.35)})`;
			if (Math.random() < 0.4)
				(el.style as any).filter =
					`hue-rotate(${Math.floor(rand(-40, 40))}deg) saturate(${rand(0.6, 1.9).toFixed(2)})`;
			if (Math.random() < 0.12)
				(el.style as any).mixBlendMode = [
					"multiply",
					"screen",
					"overlay",
					"difference",
				][Math.floor(Math.random() * 4)];
			if (Math.random() < 0.1)
				(el.style as any).backdropFilter = "blur(2px)";
			if (Math.random() < 0.15)
				(el.style as any).transform =
					`rotate(${Math.round(rand(-4, 4))}deg) skew(${Math.round(rand(-6, 6))}deg, ${Math.round(rand(-6, 6))}deg)`;
			if (Math.random() < 0.05)
				(el.style as any).textCombineUpright = "all" as any;

			modified.set(el, prev);
		} catch (e) {}
	}

	const sel =
		"p, li, h1, h2, h3, h4, h5, h6, a, span, label, button, input, textarea, pre";

	const id = window.setInterval(
		() => {
			try {
				const all = Array.from(
					document.querySelectorAll<HTMLElement>(sel),
				);
				const count = Math.max(8, Math.floor(all.length * 0.08));
				for (let i = 0; i < count; i++) {
					const el = all[Math.floor(Math.random() * all.length)];
					applyOne(el);
				}
			} catch (e) {}
		},
		freq + Math.random() * 1800,
	);

	return function stop() {
		try {
			clearInterval(id);
			modified.forEach(
				(prev: Partial<CSSStyleDeclaration>, el: HTMLElement) => {
					for (const k in prev) {
						try {
							(el.style as any)[k] = (prev as any)[k] ?? "";
						} catch (e) {}
					}
				},
			);
		} catch (e) {}
	};
}
