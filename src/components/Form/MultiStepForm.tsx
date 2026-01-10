"use client";
import React, { useEffect, useState, useRef } from "react";
import { corruptLocal } from "../../lib/corruptStorage";
import { phantomErrors } from "../../lib/validationSaboteur";
import { startHistorySaboteur } from "../../lib/historySaboteur";
import { seedFromQuery } from "../../lib/chaosTheme";
import "../../styles/form.css";

type Props = {
	attacks: Record<string, boolean>;
	close: () => void;
	open: (n: React.ReactNode) => void;
};

const defaultValues = {
	name: "",
	dob: "",
	address: "",
	ssn: "",
	terms: false,
};

export default function MultiStepForm({ attacks, close, open }: Props) {
	const [values, setValues] = useState<Record<string, any>>(() => {
		try {
			return corruptLocal.get("boff_form") || defaultValues;
		} catch {
			return defaultValues;
		}
	});
	const [step, setStep] = useState(0);
	const [errors, setErrors] = useState<
		Array<{ field: string; message: string }>
	>([]);
	const [busy, setBusy] = useState(false);
	const [submittedMessage, setSubmittedMessage] = useState<string | null>(
		null,
	);
	const [progress, setProgress] = useState(0);
	const [shuffled, setShuffled] = useState(false);
	const containerRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		function handler(e: KeyboardEvent) {
			if (e.key !== "Tab") return;
			const root = containerRef.current;
			if (!root) return;
			const focusables = Array.from(
				root.querySelectorAll<HTMLElement>(
					'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])',
				),
			).filter((el) => !el.hasAttribute("disabled"));
			if (focusables.length === 0) return;
			const active = document.activeElement as HTMLElement;
			let idx = focusables.indexOf(active);
			e.preventDefault();
			let nextIdx;
			if (e.shiftKey) {
				nextIdx = idx <= 0 ? focusables.length - 1 : idx - 1;
			} else {
				nextIdx =
					idx === -1 || idx === focusables.length - 1 ? 0 : idx + 1;
			}
			focusables[nextIdx].focus();
		}
		document.addEventListener("keydown", handler);
		return () => document.removeEventListener("keydown", handler);
	}, []);

	useEffect(() => {
		if (attacks.history) {
			const stop = startHistorySaboteur({ interval: 3000 });
			return () => stop();
		}
	}, [attacks.history]);

	useEffect(() => {
		corruptLocal.set("boff_form", values);

		setErrors(phantomErrors(values, Number(seedFromQuery())));
	}, [values]);

	useEffect(() => {
		setProgress(Math.floor((step / 3) * 100));
		if (Math.random() < 0.35)
			setTimeout(
				() =>
					setProgress((p) =>
						Math.min(100, p + 5 + Math.floor(Math.random() * 25)),
					),
				400,
			);
	}, [step]);

	useEffect(() => {
		if (!attacks.theme) return;
		const id = setInterval(
			() => {
				setShuffled((s) => !s);
				setProgress((p) =>
					Math.max(0, Math.min(100, p + (Math.random() * 40 - 20))),
				);
			},
			5000 + Math.random() * 4000,
		);
		return () => clearInterval(id);
	}, [attacks.theme]);

	function setField(k: string, v: any) {
		setValues((prev) => ({ ...prev, [k]: v }));
	}

	function next() {
		if (step < 3) setStep((s) => s + 1);
	}
	function prev() {
		if (step > 0) setStep((s) => s - 1);
	}

	async function doSubmit() {
		setBusy(true);
		try {
			const res = await fetch("/api/submit", {
				method: "POST",
				body: JSON.stringify(values),
			});
			const j = await res.json();
			setSubmittedMessage(j.message || "Submission queued");
			if (attacks.modals && Math.random() < 0.66) {
				open(
					<div>
						<h3>Clarification needed</h3>
						<p>Please confirm your place of birth for audit.</p>
						<button
							onClick={() =>
								open(
									<div>
										<p>Thank you. Review complete.</p>
										<button onClick={() => close()}>
											Close
										</button>
									</div>,
								)
							}
						>
							Provide
						</button>
					</div>,
				);
			}
		} catch (e) {
			setSubmittedMessage("Network error: queued for review.");
		}
		setBusy(false);
	}

	const seed = Number(seedFromQuery());
	const phantom = phantomErrors(values, seed);

	const nameField = (
		<label className="block">
			Full name
			<input
				value={values.name}
				onChange={(e) => setField("name", e.target.value)}
				className="block w-full mt-1"
			/>
		</label>
	);
	const dobField = (
		<label className="block mt-2">
			Date of birth
			<input
				value={values.dob}
				onChange={(e) => setField("dob", e.target.value)}
				className="block w-full mt-1"
			/>
		</label>
	);

	return (
		<div className="form-width" ref={containerRef}>
			<h2 className="form-heading">Application — Step {step + 1} of 4</h2>
			<div className="progress-track">
				<div
					className="progress-fill"
					style={{ width: `${progress}%` }}
				/>
			</div>
			<div className="mt-4">
				{step === 0 && (
					<div>
						<label className="block">
							Full name
							<input
								value={values.name}
								onChange={(e) =>
									setField("name", e.target.value)
								}
								className="block w-full mt-1"
							/>
						</label>
						<label className="block mt-2">
							Date of birth
							<input
								value={values.dob}
								onChange={(e) =>
									setField("dob", e.target.value)
								}
								className="block w-full mt-1"
							/>
						</label>
					</div>
				)}
				{step === 1 && (
					<div>
						<label className="block">
							Address
							<input
								value={values.address}
								onChange={(e) =>
									setField("address", e.target.value)
								}
								className="block w-full mt-1"
							/>
						</label>
						<label className="block mt-2">
							SSN
							<input
								value={values.ssn}
								onChange={(e) =>
									setField("ssn", e.target.value)
								}
								className="block w-full mt-1"
							/>
						</label>
					</div>
				)}
				{step === 2 && (
					<div>
						<label className="block">
							Declarations
							<div className="mt-2">
								<label className="flex items-center gap-2">
									<input
										type="checkbox"
										checked={values.terms}
										onChange={(e) =>
											setField("terms", e.target.checked)
										}
									/>{" "}
									I agree to  terms (toggling may
									clear some errors)
								</label>
							</div>
						</label>
					</div>
				)}
				{step === 3 && (
					<div>
						<h3 className="font-bold">Review</h3>
						<pre className="mt-2 bg-gray-50 p-2">
							{JSON.stringify(values, null, 2)}
						</pre>
					</div>
				)}
				<div className="mt-3">
					{phantom.map((p) => (
						<div key={p.field} className="text-red-600">
							{p.field}: {p.message}
						</div>
					))}
				</div>
				<div className="mt-4 flex gap-2 justify-end">
					{step > 0 && (
						<button
							onClick={prev}
							className="px-3 py-2 border rounded"
						>
							Back
						</button>
					)}
					{step < 3 && (
						<button
							onClick={next}
							className="px-3 py-2 border rounded"
						>
							Next
						</button>
					)}
					{step === 3 && (
						<button
							onClick={doSubmit}
							className="px-3 py-2 border rounded"
							disabled={busy}
						>
							{busy ? "Submitting..." : "Submit"}
						</button>
					)}
					<button
						onClick={() => {
							close();
							if (attacks.modals && Math.random() < 0.6)
								open(
									<div>
										<p>
											Clarification: closing this form may
											require a follow-up.
										</p>
										<button onClick={() => close()}>
											Acknowledge
										</button>
									</div>,
								);
						}}
						className="px-3 py-2 border rounded"
					>
						Close
					</button>
				</div>
				{submittedMessage && (
					<div className="mt-3 p-2 border rounded bg-gray-100">
						{submittedMessage}
					</div>
				)}
			</div>
		</div>
	);
}
