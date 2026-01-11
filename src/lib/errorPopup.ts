type Stopper = () => void;

const messages = [
	"System notice: minor inconsistency detected.",
	"Alert: background validation failed.",
	"Warning: temporary outage — rerouting.",
	"Heads up: your session may be delayed.",
	"Notice: queued for manual review.",
];

export function startErrorPopups({ interval = 30_000 } = {}): Stopper {
	if (typeof window === "undefined") return () => {};
	let id = window.setInterval(
		() => {
			try {
				if (Math.random() < 0.65) return;
				const open = (window as any).__boff_open;
				const text =
					messages[Math.floor(Math.random() * messages.length)];
				if (open) {
					try {
						open(`System Popup: ${text}`);
					} catch (e) {}
				} else {
					const d = document.createElement("div");
					d.style.position = "fixed";
					d.style.left = "12px";
					d.style.bottom = "12px";
					d.style.padding = "14px";
					d.style.background = "#330000";
					d.style.color = "#ffdddd";
					d.style.border = "3px double #ff00aa";
					d.style.zIndex = "999999";
					d.textContent = `Popup: ${text}`;
					d.onclick = () => d.remove();
					document.body.appendChild(d);
					setTimeout(() => tryRemove(d), 8000 + Math.random() * 7000);
				}
			} catch (e) {}
		},
		interval + Math.random() * 20000,
	);

	function tryRemove(el: HTMLElement) {
		try {
			el.remove();
		} catch (e) {}
	}

	return function stop() {
		try {
			clearInterval(id);
		} catch (e) {}
	};
}

export function stopErrorPopups() {}
