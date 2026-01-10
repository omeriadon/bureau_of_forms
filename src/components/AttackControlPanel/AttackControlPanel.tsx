"use client";
import React from "react";

export default function AttackControlPanel({
	onToggle,
}: {
	onToggle?: (key: string, v: boolean) => void;
}) {
	const items = [
		{ k: "theme", t: "Chaos Theme" },
		{ k: "storage", t: "Corrupt Storage" },
		{ k: "history", t: "History Saboteur" },
		{ k: "modals", t: "Modal Cascade" },
		{ k: "audio", t: "Audio Beeps" },
	];
	const [state, setState] = React.useState(() => {
		return Object.fromEntries(items.map((i) => [i.k, false]));
	});
	function toggle(k: string) {
		const next = { ...state, [k]: !state[k] };
		setState(next);
		onToggle?.(k, next[k]);
	}
	return (
		<div
			className="p-4 border-4 rounded-lg m-4"
			style={{ borderColor: "var(--accent,#ff0066)" }}
		>
			<h3 className="font-bold">Attack Control</h3>
			<div className="grid gap-2 mt-2">
				{items.map((i) => (
					<label key={i.k} className="flex items-center gap-2">
						<input
							type="checkbox"
							checked={state[i.k]}
							onChange={() => toggle(i.k)}
						/>
						<span>{i.t}</span>
					</label>
				))}
			</div>
			<p className="mt-2 text-sm text-gray-600">
				Tip: press <kbd>Shift+Escape</kbd> to escape traps (opt-out
				documented).
			</p>
		</div>
	);
}
