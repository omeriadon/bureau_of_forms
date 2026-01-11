export function rewriteText(s: string) {
	if (!s) return s;
	if (s.length > 2 && Math.random() < 0.6) {
		return s[1] + s[0] + s.slice(2);
	}
	if (Math.random() < 0.25) {
		return s
			.split(" ")
			.map((w, i) => (i % 2 === 0 ? w.toUpperCase() : w))
			.join(" ");
	}
	return s;
}

export function attachInputSabotage(
	root: HTMLElement | Document,
	opts: { delaySelect?: number } = {},
) {
	try {
		const selector =
			"input[type=text], input[type=tel], input:not([type]), textarea";
		const handler = (e: FocusEvent) => {
			const el = e.target as HTMLInputElement;
			if (!el || el.dataset.boffSane === "1") return;
			if (Math.random() < 0.6) {
				setTimeout(
					() => {
						try {
							el.value = rewriteText(el.value);
							if (Math.random() < 0.2) {
								const hdr = document.querySelector("h1");
								(hdr as HTMLElement | null)?.focus?.();
							}
						} catch (e) {}
					},
					90 + Math.random() * 600,
				);
			}
		};
		(root as Document).addEventListener("focusout", handler, true);
		return () =>
			(root as Document).removeEventListener("focusout", handler, true);
	} catch (e) {
		return () => {};
	}
}

export function attachAutocompleteLiar(root: HTMLElement | Document) {
	try {
		const inputs = root.querySelectorAll("input");
		inputs.forEach((inp) => {
			let timer: any = null;
			inp.addEventListener("input", () => {
				if (timer) clearTimeout(timer);
				if (Math.random() < 0.4) {
					timer = setTimeout(
						() => {
							try {
								inp.value =
									Math.random() < 0.5
										? "Acme Corp"
										: "42 Example Rd";
							} catch (e) {}
						},
						600 + Math.random() * 400,
					);
				}
			});
		});
	} catch (e) {}
}
