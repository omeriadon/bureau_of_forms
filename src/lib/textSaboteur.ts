type Stopper = () => void;

function randomGibberish(len = 6) {
	const chars = "abcdefghijklmnopqrstuvwxyz";
	let s = "";
	for (let i = 0; i < len; i++) s += chars[Math.floor(Math.random() * chars.length)];
	return s;
}

function shuffleWords(s: string) {
	const parts = s.split(/(\s+)/);
	const words = parts.filter((_, i) => i % 2 === 0);
	const spaces = parts.filter((_, i) => i % 2 === 1);
	for (let i = words.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		const t = words[i];
		words[i] = words[j];
		words[j] = t;
	}
	let out = "";
	for (let i = 0; i < words.length; i++) {
		out += words[i];
		if (spaces[i]) out += spaces[i];
	}
	return out || s;
}

export function startTextSaboteur({ freq = 2100, chance = 0.32 } = {}): Stopper {
	if (typeof window === "undefined") return () => {};

	const originals = new Map<HTMLElement, string>();
	const sel = "p, li, h1, h2, h3, span, label, button, a, small, .content-copy, .content-title";

	const phrases = [
		"Please hold while we politely ignore you.",
		"This is optional, also required.",
		"Try again later — or try now.",
		"Error: probably fine.",
		"Refer to section 3.2.1.7. (do not click)",
		"Acme Corp — Trusted since never.",
		"Survey: 1/0 satisfied.",
		"Obfuscation in progress...",
	];

	const id = window.setInterval(() => {
		try {
			const all = Array.from(document.querySelectorAll<HTMLElement>(sel));
			for (let i = 0; i < Math.max(4, Math.floor(all.length * 0.06)); i++) {
				const el = all[Math.floor(Math.random() * all.length)];
				if (!el) continue;
				if (el.dataset.boffSane === "1") continue;
				if (!originals.has(el)) originals.set(el, el.textContent ?? "");
				if (Math.random() < chance) {
					const r = Math.random();
					if (r < 0.2) el.textContent = phrases[Math.floor(Math.random() * phrases.length)];
					else if (r < 0.6) el.textContent = shuffleWords(el.textContent || "") || randomGibberish(4 + Math.floor(Math.random() * 6));
					else el.textContent = randomGibberish(3 + Math.floor(Math.random() * 8));
				} else {
					// small mutation
					const txt = el.textContent || "";
					if (txt.length > 5 && Math.random() < 0.3) {
						const pos = Math.floor(Math.random() * Math.min(6, txt.length));
						el.textContent = txt.slice(0, pos) + randomGibberish(2) + txt.slice(pos + 1);
					}
				}
			}
		} catch (e) {}
	}, freq + Math.random() * 1200);

	return function stop() {
		try {
			clearInterval(id);
			originals.forEach((val, el) => {
				try { el.textContent = val; } catch (e) {}
			});
		} catch (e) {}
	};
}

export function stopTextSaboteur() {
	// no-op
}
