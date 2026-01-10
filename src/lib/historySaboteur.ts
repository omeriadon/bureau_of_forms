export function startHistorySaboteur(opts: { interval?: number } = {}) {
	if (typeof window === "undefined") return () => {};
	const sane =
		new URLSearchParams(window.location.search).get("sane") === "1" ||
		localStorage.getItem("boff_sane") === "1";
	if (sane) return () => {};
	const interval = opts.interval || 2000;
	const id = window.setInterval(() => {
		try {
			const base = Date.now();
			const messages = [
				"You are still on step 2",
				"Please confirm details",
				"Session updated — remain on this page",
			];
			const fake = {
				t: base,
				msg: messages[Math.floor(Math.random() * messages.length)],
			};
			history.pushState(
				fake,
				"",
				window.location.href + "#" + (base % 997),
			);
			setTimeout(() => history.pushState({ ...fake, r: 1 }, ""), 80);
			setTimeout(
				() => history.replaceState({ ...fake, replaced: true }, ""),
				220 + Math.random() * 200,
			);
		} catch (_) {}
	}, interval);
	return () => clearInterval(id);
}
