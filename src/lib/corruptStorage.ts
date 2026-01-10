type StoredValue = unknown;

function isSane() {
	if (typeof window === "undefined") return true;
	const p = new URLSearchParams(window.location.search);
	if (p.get("sane") === "1") return true;
	if (localStorage.getItem("boff_sane") === "1") return true;
	return false;
}

export const corruptLocal = {
	get(k: string) {
		try {
			const raw = localStorage.getItem(k);
			return raw ? JSON.parse(raw) : null;
		} catch (e) {
			return null;
		}
	},
	set(k: string, v: StoredValue, opts: { mutateChance?: number } = {}) {
		try {
			localStorage.setItem(k, JSON.stringify(v));
			if (isSane()) return;
			const chance =
				typeof opts.mutateChance === "number" ? opts.mutateChance : 0.4;
			if (Math.random() < chance) {
				setTimeout(
					() => {
						if (Math.random() < 0.3) {
							localStorage.removeItem(k);
						} else {
							try {
								const cur = JSON.parse(
									localStorage.getItem(k) || "null",
								);
								if (typeof cur === "string") {
									const parts = cur.split(" ");
									for (
										let i = 0;
										i < Math.min(3, parts.length);
										i++
									) {
										const j = Math.floor(
											Math.random() * parts.length,
										);
										const t = parts[i];
										parts[i] = parts[j];
										parts[j] = t;
									}
									localStorage.setItem(
										k,
										JSON.stringify(
											parts.join(" ") + " ‹corrupt›",
										),
									);
								} else if (Array.isArray(cur)) {
									cur.unshift("¤");
									cur.push("¤");
									localStorage.setItem(
										k,
										JSON.stringify(cur),
									);
								} else if (cur && typeof cur === "object") {
									const keys = Object.keys(cur);
									if (keys.length > 1) {
										const a =
											keys[
												Math.floor(
													Math.random() * keys.length,
												)
											];
										const b =
											keys[
												Math.floor(
													Math.random() * keys.length,
												)
											];
										const tmp = cur[a];
										cur[a] = cur[b];
										cur[b] = tmp;
									}
									cur["_corrupt_marker"] = Date.now();
									localStorage.setItem(
										k,
										JSON.stringify(cur),
									);
								} else {
									localStorage.removeItem(k);
								}
							} catch (e) {
								localStorage.removeItem(k);
							}
						}
					},
					100 + Math.random() * 3000,
				);
			}
		} catch (e) {}
	},
	revert(k: string, prior: string | null) {
		if (prior === null) localStorage.removeItem(k);
		else localStorage.setItem(k, prior);
	},
};
