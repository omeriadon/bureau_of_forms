type Stopper = () => void;

export function startFormPopper({ interval = 8000 } = {}): Stopper {
	if (typeof window === "undefined") return () => {};
	const sane =
		new URLSearchParams(window.location.search).get("sane") === "1" ||
		localStorage.getItem("boff_sane") === "1";
	if (sane) return () => {};

	const id = window.setInterval(
		() => {
			try {
				// moderate chance to trigger a form pop
				if (Math.random() > 0.6) return;
				const start = (window as any).__boff_start;
				if (typeof start === "function") {
					start();
					return;
				}
				const open = (window as any).__boff_open;
				if (open) {
					open(
						"Action required: additional application details needed.",
					);
				}
			} catch (e) {}
		},
		interval + Math.random() * 4000,
	);

	return function stop() {
		try {
			clearInterval(id);
		} catch (e) {}
	};
}
