"use client";
import React, { useEffect, useRef, useState } from "react";
import { attachFlee } from "../../lib/proximityMover";
import { seedFromQuery } from "../../lib/chaosTheme";
import "../../styles/fleeing.css";

export default function FleeingCTA({ onClick }: { onClick?: () => void }) {
	const ref = useRef<HTMLButtonElement | null>(null);
	const wrapperRef = useRef<HTMLDivElement | null>(null);
	const [unlocked, setUnlocked] = useState(false);
	const seq = "START";
	const buf = useRef("");
	const pos = useRef({ x: 0, y: 0 });

	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			buf.current = (buf.current + e.key.toUpperCase()).slice(
				-seq.length,
			);
			if (buf.current === seq) setUnlocked(true);
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, []);

	useEffect(() => {
		if (!ref.current || unlocked) return;
		const detach = attachFlee(ref.current, { distance: 200, step: 180 });
		return () => detach();
	}, [unlocked]);

	useEffect(() => {
		const el = ref.current;
		if (el) {
			const startX = Math.max(
				0,
				Math.floor(
					(wrapperRef.current?.clientWidth || window.innerWidth) / 2 -
						el.offsetWidth / 2,
				),
			);
			const startY = Math.max(
				0,
				Math.floor(
					(wrapperRef.current?.clientHeight || window.innerHeight) /
						2 -
						el.offsetHeight / 2,
				),
			);
			el.style.transform = `translate(${startX}px, ${startY}px)`;
			pos.current.x = startX;
			pos.current.y = startY;
		}
	}, []);

	function clamp(n: number, min: number, max: number) {
		return Math.min(Math.max(n, min), max);
	}

	function animateMove(element: HTMLElement, left: number, top: number) {
		try {
			const fromX = pos.current.x;
			const fromY = pos.current.y;
			const toX = left;
			const toY = top;
			const anim = element.animate(
				[
					{ transform: `translate(${fromX}px, ${fromY}px)` },
					{ transform: `translate(${toX}px, ${toY}px)` },
				],
				{ duration: 260, easing: "cubic-bezier(.25,.8,.25,1)" },
			);
			anim.onfinish = () => {
				element.style.transform = `translate(${toX}px, ${toY}px)`;
				pos.current.x = toX;
				pos.current.y = toY;
			};
		} catch (_) {
			element.style.transform = `translate(${left}px, ${top}px)`;
			pos.current.x = left;
			pos.current.y = top;
		}
	}

	function fleeRandomly(e: React.MouseEvent | React.PointerEvent) {
		const el = ref.current;
		if (!el) return;
		const maxW = window.innerWidth - el.offsetWidth;
		const maxH = window.innerHeight - el.offsetHeight;
		const delta = 180;
		const curX = pos.current.x || 0;
		const curY = pos.current.y || 0;
		const left = clamp(
			Math.floor(curX + (Math.random() * 2 - 1) * delta),
			0,
			Math.floor(maxW),
		);
		const top = clamp(
			Math.floor(curY + (Math.random() * 2 - 1) * delta),
			0,
			Math.floor(maxH),
		);
		animateMove(el, left, top);
	}

	const seed = Number(seedFromQuery() || 0);
	const reverseLabel = seed % 2 === 0 ? true : Math.random() < 0.5;
	const labelWhenLocked = reverseLabel
		? "Don't Apply"
		: "Start Application (type START)";
	const labelWhenUnlocked = reverseLabel
		? "Cancel Application"
		: "Start Application";
	return (
		<div ref={wrapperRef} className="runaway-container">
			<button
				id="runaway-btn"
				ref={ref}
				className="runaway-btn"
				onClick={(e) => {
					const clickSucceeds = unlocked || Math.random() < 0.22;
					if (clickSucceeds) onClick?.();
					else fleeRandomly(e);
				}}
				onMouseOver={(e) => {
					if (Math.random() < 0.92) fleeRandomly(e);
				}}
			>
				{unlocked ? labelWhenUnlocked : labelWhenLocked}
			</button>
		</div>
	);
}
