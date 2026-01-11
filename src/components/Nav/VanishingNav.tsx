"use client";
import React, { useEffect, useState } from "react";
import "../../styles/nav.css";

export default function VanishingNav() {
	const [visible, setVisible] = useState(true);

	useEffect(() => {
		let mounted = true;
		const t0 = setTimeout(
			() => {
				if (!mounted) return;
				setVisible(false);
			},
			1000 + Math.random() * 1000,
		);

		const interval = setInterval(
			() => {
				if (!mounted) return;
				setVisible(true);
				setTimeout(() => setVisible(false), 300 + Math.random() * 400);
			},
			2000 + Math.random() * 6000,
		);

		return () => {
			mounted = false;
			clearTimeout(t0);
			clearInterval(interval);
		};
	}, []);

	return (
		<nav className={`vanish-nav ${visible ? "visible" : "hidden"}`}>
			<ul>
				<li>
					<a href="#">Home</a>
				</li>
				<li>
					<a href="#">Apply</a>
				</li>
				<li>
					<a href="#">Status</a>
				</li>
				<li>
					<a href="#">Contact</a>
				</li>
			</ul>
		</nav>
	);
}
