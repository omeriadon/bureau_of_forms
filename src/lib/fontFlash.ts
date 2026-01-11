type Stopper = () => void;

const fonts = [
	"Boff-36Days",
	"Boff-Amakan",
	"Boff-Excessive",
	"Boff-Jovian",
	"Boff-Lobular",
	"Boff-PACR",
	"Boff-ReadyCloud",
];

export function startFontFlash({
	interval = 10000,
	duration = 900,
} = {}): Stopper {
	if (typeof window === "undefined") return () => {};
	let id = window.setInterval(
		() => {
			try {
				const f = fonts[Math.floor(Math.random() * fonts.length)];
				const prev = document.body.style.fontFamily || "";
				document.body.style.fontFamily = `${f}, ${prev}`;
				setTimeout(() => {
					try {
						document.body.style.fontFamily = prev;
					} catch (e) {}
				}, duration);
			} catch (e) {}
		},
		interval + Math.random() * 800,
	);

	return function stop() {
		try {
			clearInterval(id);
		} catch (e) {}
	};
}

