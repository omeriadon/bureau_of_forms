"use client";
import React, { useState, useRef } from "react";

export default function TeleportMenu() {
	const [open, setOpen] = useState(false);
	const [pos, setPos] = useState<{ left: number; top: number }>({
		left: 40,
		top: 60,
	});
	const menuRef = useRef<HTMLDivElement | null>(null);

	function show() {
		const x = Math.random() * (window.innerWidth - 220);
		const y = Math.random() * (window.innerHeight - 220);
		setPos({ left: Math.max(0, x), top: Math.max(0, y) });
		setOpen(true);
	}

	function maybeRepositionBeforeNavigate(e: React.MouseEvent, href?: string) {
		if (Math.random() < 0.5) {
			show();
			e.preventDefault();
			setTimeout(
				() => {
					if (href) window.location.href = href;
				},
				120 + Math.random() * 600,
			);
		}
	}

	return (
		<div className="teleport-menu-container">
			<button
				className="hamburger"
				onClick={() => (open ? setOpen(false) : show())}
			>
				☰
			</button>
			{open && (
				<div
					ref={menuRef}
					className="teleport-menu"
					style={{ left: pos.left, top: pos.top }}
				>
					<a
						href="#"
						onClick={(e) =>
							maybeRepositionBeforeNavigate(e, "#apply")
						}
					>
						Apply
					</a>
					<a
						href="#"
						onClick={(e) =>
							maybeRepositionBeforeNavigate(e, "#status")
						}
					>
						Status
					</a>
					<a
						href="#"
						onClick={(e) =>
							maybeRepositionBeforeNavigate(e, "#about")
						}
					>
						About
					</a>
				</div>
			)}
		</div>
	);
}
