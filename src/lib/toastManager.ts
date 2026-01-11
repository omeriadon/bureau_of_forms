type Stopper = () => void;

const uglyDesigns = [
	{ bg: "#ff0077", color: "#fff", border: "4px solid #000" },
	{ bg: "#fff200", color: "#0b0b0b", border: "3px dashed #ff00aa" },
	{ bg: "#00ffcc", color: "#002", border: "2px solid #ff00aa" },
	{ bg: "#0f0f3f", color: "#ffd1d1", border: "6px double #00ff44" },
];

function rand(min: number, max: number) {
	return Math.random() * (max - min) + min;
}

export function startToastStorm({ freq = 1800 } = {}): Stopper {
	if (typeof window === "undefined") return () => {};
	let id = window.setInterval(
		() => {
			try {
				const t = document.createElement("div");
				const d =
					uglyDesigns[Math.floor(Math.random() * uglyDesigns.length)];
				const w = 140 + Math.floor(Math.random() * 240);
				t.style.position = "fixed";
				t.style.right = Math.floor(Math.random() * 80) + "px";
				t.style.top =
					Math.floor(Math.random() * (window.innerHeight - 60)) +
					"px";
				t.style.width = `${w}px`;
				t.style.padding = "8px 12px";
				t.style.background = d.bg;
				t.style.color = d.color;
				t.style.border = d.border;
				t.style.boxShadow = `0 8px 20px rgba(0,0,0,0.35)`;
				t.style.zIndex = "99999";
				t.style.fontFamily = "'Boff-36Days', monospace";
				t.style.fontSize = `${Math.floor(rand(14, 22))}px`; // larger, more readable toasts
				const codes = [
					"404",
					"402",
					"500",
					"ERR-02",
					"E:9009",
					"uwu-0xdead",
				];
				const code = codes[Math.floor(Math.random() * codes.length)];
				const texts = [
					`Code ${code}: Something probably happened.`,
					`Notice ${code}: Your patience is appreciated.`,
					`⚠️ ${code} — Please do not panic.`,
					`Error ${code}: Try again later or never.`,
				];
				t.textContent = texts[Math.floor(Math.random() * texts.length)];
				document.body.appendChild(t);
				setTimeout(
					() => {
						try {
							t.style.opacity = "0";
							setTimeout(() => t.remove(), 600);
						} catch (e) {}
					},
					2200 + Math.random() * 3000,
				);
			} catch (e) {}
		},
		freq + Math.random() * 1200,
	);

	return function stop() {
		try {
			clearInterval(id);
		} catch (e) {}
	};
}
