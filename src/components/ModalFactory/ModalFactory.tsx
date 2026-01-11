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
	open,
}: {
	stack: Array<React.ReactNode>;
	close: () => void;
	open: (n: React.ReactNode) => void;
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

	const closeCountRef = React.useRef(0);
	const [closeScale, setCloseScale] = React.useState(1);

	function handleClose(e: React.MouseEvent) {
		if (e.altKey) {
			closeCountRef.current = 0;
			setCloseScale(1);
		} else {
			closeCountRef.current += 1;
			setCloseScale(
				Math.max(0.12, Math.pow(0.85, closeCountRef.current)),
			);
		}
		close();
	}

	if (!stack.length) return null;
	return (
		<>
			<div className="modal-overlay fixed inset-0">
				<button
					aria-hidden
					style={{
						position: "absolute",
						inset: 0,
						opacity: 0,
						border: 0,
						background: "transparent",
					}}
					onClick={() => {
						try {
							if (
								(window as any).__boff_attacks?.modals &&
								Math.random() < 0.5
							) {
								open(
									<div>
										<p>Intercepted by the overlay.</p>
										<button onClick={() => close()}>
											Close
										</button>
									</div>,
								);
							}
						} catch (e) {}
					}}
				/>
			</div>
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
							onClick={(e) => {
								handleClose(e);
								try {
									if (
										(window as any).__boff_attacks
											?.modals &&
										Math.random() < 0.6
									) {
										open(
											<div>
												<p>
													Follow up: extra form
													required.
												</p>
												<button onClick={() => close()}>
													Close
												</button>
											</div>,
										);
										open(
											<div>
												<p>
													Additional clarification
													needed.
												</p>
												<button onClick={() => close()}>
													Close
												</button>
											</div>,
										);
									}
								} catch (e) {}
							}}
							className="px-3 py-2 border rounded"
							style={{
								transform: `scale(${closeScale})`,
								transformOrigin: "right center",
								transition: "transform 180ms linear",
							}}
						>
							Close
						</button>
					</div>
				</div>
			</div>
		</>
	);
}
