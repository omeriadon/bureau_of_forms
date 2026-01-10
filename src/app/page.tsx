"use client";
import React, { useEffect, useRef, useState } from "react";
import "./globals.css";
import "../styles/chaos.css";
import "../styles/page.css";
import FleeingCTA from "../components/FleeingCTA/FleeingCTA";
import ModalHost, {
	useModalFactory,
} from "../components/ModalFactory/ModalFactory";
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
	} as const;
	const { stack, open, close } = useModalFactory();
	const audioRef = useRef<number | null>(null);

	useEffect(() => {
		if (typeof window === "undefined") return;

		try {
			localStorage.removeItem("boff_sane");
		} catch (e) {}
	}, []);

	useEffect(() => {
		import("../lib/audioManager").then((m) => m.startAtrociousAudio());
		return () => {
			import("../lib/audioManager")
				.then((m) => m.stopAtrociousAudio())
				.catch(() => {});
		};
	}, []);


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
	}, []);

	return (
		<div className="page-root min-h-screen p-8">
			<header className="flex items-center gap-4 mb-6">
				<h1 className="text-3xl font-extrabold chaos-jitter">
					Bureau of Forms
				</h1>
			</header>
			<div className="garish-banner">
				OFFICIAL NOTICE: Please have patience and check your entries
				twice (or don't).
			</div>
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
					<p className="text-xs">
						Seed controls randomness — use <code>?seed=1234</code>{" "}
						to reproduce a run.
					</p>
				</section>
			</main>
			<ModalHost stack={stack} close={close} />
		</div>
	);
}
