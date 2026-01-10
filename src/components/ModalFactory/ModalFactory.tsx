"use client";
import React, { useState } from "react";

export function useModalFactory() {
	const [stack, setStack] = useState<Array<React.ReactNode>>([]);
	function open(node: React.ReactNode) {
		setStack((s) => [...s, node]);
	}
	function close() {
		setStack((s) => s.slice(0, -1));
	}
	return { stack, open, close };
}

export default function ModalHost({
	stack,
	close,
}: {
	stack: Array<React.ReactNode>;
	close: () => void;
}) {
	React.useEffect(() => {
		if (stack.length > 0) {
			try {
				document.body.classList.add("overlay-active");
			} catch (e) {}
		} else {
			try {
				document.body.classList.remove("overlay-active");
			} catch (e) {}
		}
		return () => {
			try {
				document.body.classList.remove("overlay-active");
			} catch (e) {}
		};
	}, [stack.length]);

	if (!stack.length) return null;
	return (
		<>
			<div className="modal-overlay fixed inset-0" />
			<div
				className="modal-host fixed inset-0 z-50 flex items-center justify-center"
				style={{ pointerEvents: "auto" }}
			>
				<div
					className="bg-white p-6 border-4"
					style={{ borderColor: "var(--accent,#ff0066)" }}
				>
					{stack[stack.length - 1]}
					<div className="flex gap-2 justify-end mt-4">
						<button
							onClick={close}
							className="px-3 py-2 border rounded"
						>
							Close
						</button>
					</div>
				</div>
			</div>
		</>
	);
}
