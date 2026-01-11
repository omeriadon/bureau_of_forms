"use client";
import React, { useEffect, useRef, useState } from "react";
import "./globals.css";
import "../styles/chaos.css";
import "../styles/page.css";
import FleeingCTA from "../components/FleeingCTA/FleeingCTA";
import ModalHost, {
	useModalFactory,
} from "../components/ModalFactory/ModalFactory";
import VanishingNav from "../components/Nav/VanishingNav";
import TeleportMenu from "../components/Nav/TeleportMenu";
import {
	applyRandomTheme,
	clearChaosTheme,
	seedFromQuery,
} from "../lib/chaosTheme";

export default function Home() {
	const attacks = {
		theme: true,
		storage: true,
		history: true,
		modals: true,
		audio: true,
		perf: true,
		inputs: true,
		navigation: true,
		ui: true,
	} as const;
	const { stack, open, close } = useModalFactory();
	const audioRef = useRef<number | null>(null);

	useEffect(() => {
		if (typeof window === "undefined") return;

		try {
			localStorage.removeItem("boff_sane");
			(window as any).__boff_attacks = attacks;
		} catch (e) {}
	}, []);

	useEffect(() => {
		let perfStop: (() => void) | null = null;
		import("../lib/audioManager").then((m) => m.startAtrociousAudio());
		import("../lib/perfSaboteur")
			.then((m) => {
				if (attacks.perf)
					perfStop = m.startPerfSaboteur({ intensity: 0.75 });
			})
			.catch(() => {});
		import("../lib/historySaboteur").then((m) => {
			try {
				if (attacks.history)
					(window as any).__boff_history = m.startHistorySaboteur({
						interval: 1800,
					});
			} catch (e) {}
		});
		return () => {
			import("../lib/audioManager")
				.then((m) => m.stopAtrociousAudio())
				.catch(() => {});
			import("../lib/perfSaboteur")
				.then((m) => m.stopPerfSaboteur())
				.catch(() => {});
			if (perfStop) {
				try {
					perfStop();
				} catch (_) {}
				perfStop = null;
			}
			try {
				if ((window as any).__boff_history)
					(window as any).__boff_history();
			} catch (e) {}
		};
	}, [attacks.perf]);

	useEffect(() => {
		if (typeof window === "undefined") return;
		let detachClick: (() => void) | null = null;
		let detachInput: (() => void) | null = null;
		let fontId: number | null = null;
		let purgeId: number | null = null;
		let typoStop: (() => void) | null = null;
		let textStop: (() => void) | null = null;
		let fontFlashStop: (() => void) | null = null;
		let formPopStop: (() => void) | null = null;
		function onScroll() {
			try {
				if (Math.random() < 0.25) {
					window.scrollBy(0, (Math.random() - 0.5) * 60);
				}
			} catch (e) {}
		}

		if (attacks.navigation || attacks.inputs || attacks.ui) {
			import("../lib/clickSaboteur").then((m) => {
				detachClick = m.attachClickSabotage(document);
			});
			import("../lib/inputSaboteur").then((m) => {
				if (attacks.inputs)
					detachInput = m.attachInputSabotage(document);
				m.attachAutocompleteLiar(document);
			});
			import("../lib/toastManager").then((m) => {
				try {
					if (attacks.ui)
						(window as any).__boff_toasts = m.startToastStorm({
							freq: 1600,
						});
				} catch (e) {}
			});
			import("../lib/errorPopup").then((m) => {
				try {
					if (attacks.modals)
						(window as any).__boff_errors = m.startErrorPopups({
							interval: 30000,
						});
				} catch (e) {}
			});
			import("../lib/typographySaboteur").then((m) => {
				try {
					if (attacks.ui || attacks.theme)
						typoStop = m.startTypographySaboteur({ freq: 1200 });
				} catch (e) {}
			});
			import("../lib/fontFlash").then((m) => {
				try {
					if (attacks.ui)
						fontFlashStop = m.startFontFlash({
							interval: 10000,
							duration: 900,
						});
				} catch (e) {}
			});
			import("../lib/textSaboteur").then((m) => {
				try {
					if (attacks.ui || attacks.inputs)
						textStop = m.startTextSaboteur({
							freq: 1500,
							chance: 0.38,
						});
				} catch (e) {}
			});
			import("../lib/formPopupSaboteur").then((m) => {
				try {
					if (attacks.modals)
						(window as any).__boff_formPop = m.startFormPopper({
							interval: 7000,
						});
				} catch (e) {}
			});
			fontId = window.setInterval(
				() => {
					try {
						const ps = Array.from(
							document.querySelectorAll(
								"p, li, h1, h2, h3, h4, h5, h6, a, button, span, label, input, textarea, pre",
							),
						);
						ps.forEach((p: Element, i) => {
							if (Math.random() < 0.18) {
								const cls = `font-salad-${1 + Math.floor(Math.random() * 7)}`;
								(p as HTMLElement).classList.remove(
									"font-salad-1",
									"font-salad-2",
									"font-salad-3",
									"font-salad-4",
									"font-salad-5",
									"font-salad-6",
									"font-salad-7",
								);
								(p as HTMLElement).classList.add(cls);
							}
						});
						const buttons = Array.from(
							document.querySelectorAll("button"),
						);
						buttons.forEach((b: Element) => {
							try {
								const be = b as HTMLButtonElement;
								if (Math.random() < 0.06) {
									if (/submit/i.test(be.textContent || ""))
										be.textContent = "Cancel";
									else if (
										/cancel/i.test(be.textContent || "")
									)
										be.textContent = "Submit";
									else if (
										/delete/i.test(be.textContent || "")
									)
										be.textContent = "Keep";
								}
							} catch (e) {}
						});
					} catch (e) {}
				},
				3500 + Math.random() * 5000,
			);

			document.body.classList.add("gradient-storm-enabled");

			const purgeId = window.setInterval(
				() => {
					try {
						if (Math.random() < 0.9) sessionStorage.clear();
					} catch (e) {}
				},
				4 * 60 * 1000,
			);
			(window as any).__boff_open = open;
			(window as any).__boff_start = onStart;

			window.addEventListener("scroll", onScroll);
		}

		return () => {
			if (fontId) clearInterval(fontId);
			if (purgeId) clearInterval(purgeId);
			if (typoStop)
				try {
					typoStop();
				} catch (e) {}
			if (textStop)
				try {
					textStop();
				} catch (e) {}
			try {
				if ((window as any).__boff_toasts)
					(window as any).__boff_toasts();
			} catch (e) {}
			try {
				if ((window as any).__boff_errors)
					(window as any).__boff_errors();
			} catch (e) {}
			try {
				if ((window as any).__boff_formPop)
					(window as any).__boff_formPop();
			} catch (e) {}
			try {
				if (fontFlashStop) fontFlashStop();
			} catch (e) {}
			document.body.classList.remove("gradient-storm-enabled");
			window.removeEventListener("scroll", onScroll);
			if (detachClick)
				try {
					detachClick();
				} catch (e) {}
			if (detachInput)
				try {
					detachInput();
				} catch (e) {}
			(window as any).__boff_open = undefined;
			(window as any).__boff_start = undefined;
		};
	}, [attacks.navigation, attacks.inputs, attacks.ui]);

	function onStart() {
		const MultiStepForm =
			require("../components/Form/MultiStepForm").default;
		open(
			<div>
				<h2 className="font-bold text-xl">Application</h2>
				<p>Preparing form...</p>
			</div>,
		);
		setTimeout(() => {
			open(<MultiStepForm attacks={attacks} close={close} open={open} />);
		}, 220);
	}

	const [seed, setSeed] = useState<number | null>(null);
	useEffect(() => {
		setSeed(seedFromQuery());
		applyRandomTheme(seedFromQuery());
		let themeStop: (() => void) | null = null;
		if ((window as any).__boff_attacks?.theme) {
			import("../lib/chaosTheme").then((m) => {
				try {
					themeStop = m.startThemeSaboteur({ interval: 4000 });
				} catch (e) {}
			});
		}
		return () => {
			if (themeStop)
				try {
					themeStop();
				} catch (e) {}
		};
	}, []);

	const [entered, setEntered] = React.useState(false);
	return (
		<div className="page-root min-h-screen p-8">
			<header className="flex items-center gap-4 mb-6">
				<VanishingNav />
				<div style={{ flex: 1 }}>
					<h1 className="text-3xl font-extrabold chaos-jitter">
						Bureau of Forms
					</h1>
				</div>
				<TeleportMenu />
			</header>
			<div className="garish-banner">
				OFFICIAL NOTICE: Please have patience and check your entries
				twice (or don't).
			</div>{" "}
			{!entered && (
				<div
					className="fake-404 p-6 border-4"
					style={{ position: "relative" }}
				>
					<h2 className="content-title">404 — Page not found</h2>
					<p className="content-copy">
						We couldn't find what you're looking for. A small link
						is hidden — try{" "}
						<a
							href="#enter"
							onClick={(e) => {
								e.preventDefault();
								setEntered(true);
							}}
						>
							enter
						</a>
						.
					</p>
				</div>
			)}{" "}
			<main className="main-grid">
				<section className="content-section">
					<h2 className="content-title chaos-flicker">
						Apply for a Permit
					</h2>
					<p className="content-copy">
						This service is provided as a public experiment in
						bureaucracy and patience.
					</p>
					<div className="mt-6">
						<div className="runaway-place">
							<FleeingCTA onClick={onStart} />
						</div>
					</div>
				</section>
				<section className="sidebar">
					<h3 className="font-bold">About</h3>
					<p>Seed: {seed === null ? "—" : seed}</p>
				</section>
			</main>
			{attacks.ui && <div className="gradient-storm" aria-hidden />}
			<ModalHost stack={stack} close={close} open={open} />
		</div>
	);
}
