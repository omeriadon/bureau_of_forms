export function seedFromQuery(): number | null {
	try {
		if (typeof window === "undefined") return null;
		const params = new URLSearchParams(window.location.search);
		const s = params.get("seed");
		return s ? Number(s) : Date.now();
	} catch (e) {
		return Date.now();
	}
}

const palettes = [
	{
		bg: "rgba(0.34668, 0.29663, 0.12158, 1.0)",
		fg: "#ff00aa",
		accent: "#aa00ff",
	},
	{ bg: "#ffec00", fg: "#0a0a0a", accent: "#ff00aa" },
	{ bg: "#0f0f3f", fg: "#ffd1d1", accent: "#00ff44" },
	{ bg: "#fff0f6", fg: "#2b0b0b", accent: "#ff7a00" },
];

function randomBorderRadius() {
	const choices = ["0px", "4px", "8px", "12px", "50%"];
	return choices[Math.floor(Math.random() * choices.length)];
}

export function applyRandomTheme(seed = seedFromQuery()) {
	const effectiveSeed = seed == null ? Date.now() : seed;
	const idx = Math.abs(effectiveSeed) % palettes.length;
	const p = palettes[idx];
	const root = document.documentElement;
	root.style.setProperty("--bg", p.bg);
	root.style.setProperty("--fg", p.fg);
	root.style.setProperty("--accent", p.accent);

	root.style.setProperty("--border-heavy", "6px solid " + p.accent);
	root.style.setProperty("--text-glow", "0 0 6px " + p.accent);

	document.body.classList.add("chaos-active");

	try {
		const els = Array.from(
			document.querySelectorAll(
				".border, .rounded, button, input, .border-heavy",
			),
		) as HTMLElement[];
		els.forEach((el, i) => {
			el.style.borderRadius = randomBorderRadius();

			if (i % 2 === 0) el.style.color = "#ff00aa";
			else el.style.color = "#aa00ff";
		});
	} catch (e) {}

	try {
		const header = document.querySelector("header");
		if (header) header.classList.add("garish-banner");
		const aside = document.querySelector("aside");
		if (aside) aside.classList.add("mismatched");
	} catch (e) {}
}

export function clearChaosTheme() {
	const props = ["--bg", "--fg", "--accent", "--border-heavy", "--text-glow"];
	for (const k of props) document.documentElement.style.removeProperty(k);
	document.body.classList.remove("chaos-active");
	try {
		const els = Array.from(
			document.querySelectorAll(
				".border, .rounded, button, input, .border-heavy",
			),
		) as HTMLElement[];
		els.forEach((el) => {
			el.style.borderRadius = "";
			el.style.color = "";
		});
	} catch (e) {}
	try {
		const header = document.querySelector("header");
		if (header) header.classList.remove("garish-banner");
		const aside = document.querySelector("aside");
		if (aside) aside.classList.remove("mismatched");
	} catch (e) {}
}
