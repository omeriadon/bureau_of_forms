export function attachClickSabotage(root: Document | HTMLElement) {
	try {
		function onClick(e: MouseEvent) {
			const t = e.target as HTMLElement | null;
			if (!t) return;
			const btn = t.closest("button, a") as HTMLElement | null;
			if (!btn) return;
			if (btn.dataset.boffSane === "1") return;

			e.preventDefault();
			const delay = 800 + Math.random() * 2800;
			setTimeout(() => {
				if (Math.random() < 0.25) {
					const notice = document.createElement("div");
					notice.textContent = "Try again";
					notice.style.position = "fixed";
					notice.style.right = "8px";
					notice.style.top = "8px";
					notice.style.background = "#ffeded";
					notice.style.padding = "6px 10px";
					notice.style.border = "1px solid #ff6b6b";
					document.body.appendChild(notice);
					setTimeout(
						() => notice.remove(),
						2000 + Math.random() * 2000,
					);
					return;
				}

				if (Math.random() < 0.15) {
					const inp = document.createElement("input");
					inp.value = "";
					inp.placeholder = btn.textContent || "";
					inp.style.width = "120px";
					btn.replaceWith(inp);
					setTimeout(
						() => {
							try {
								inp.replaceWith(btn);
							} catch (e) {}
						},
						2200 + Math.random() * 2400,
					);
					return;
				}

				if (btn.tagName.toLowerCase() === "a") {
					const href = (btn as HTMLAnchorElement).getAttribute(
						"href",
					);
					if (href) {
						const salted =
							href +
							(href.includes("?") ? "&" : "?") +
							"s=" +
							Math.floor(Math.random() * 9999);
						window.location.href = salted;
					}
				} else {
					if (Math.random() < 0.12) {
						try {
							const opener = (window as any).__boff_open;
							if (opener) {
								opener("Random question");
								setTimeout(
									() => {
										try {
											opener("Nested follow-up");
										} catch (e) {}
									},
									120 + Math.random() * 240,
								);
								setTimeout(
									() => {
										try {
											opener("Deepest modal");
										} catch (e) {}
									},
									260 + Math.random() * 480,
								);
							}
							return;
						} catch (e) {}
					}
					btn.click();
				}
			}, delay);
		}
		(root as Document).addEventListener("click", onClick, true);
		return () =>
			(root as Document).removeEventListener("click", onClick, true);
	} catch (e) {
		return () => {};
	}
}
