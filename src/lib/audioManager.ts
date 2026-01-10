let audioEl: HTMLAudioElement | null = null;
let audioCtx: AudioContext | null = null;
let sourceNode: MediaElementAudioSourceNode | null = null;
let gainNode: GainNode | null = null;

export function startAtrociousAudio(src = "/interesting.webm") {
	try {
		if (!audioEl) {
			audioEl = new Audio(src);
			audioEl.loop = true;
			audioEl.volume = 1.0;
			audioEl.playbackRate = 1.8;
			audioEl.preload = "auto";
			audioEl.crossOrigin = "anonymous";
		}

		if (typeof window !== "undefined") {
			try {
				audioCtx =
					audioCtx ||
					new (
						window.AudioContext ||
						(window as any).webkitAudioContext
					)();
				if (!sourceNode && audioEl) {
					sourceNode = audioCtx.createMediaElementSource(audioEl);
				}
				if (!gainNode && audioCtx) {
					gainNode = audioCtx.createGain();
					// amplify beyond nominal 0-1 volume (may clip) — intentionally harsh
					gainNode.gain.value = 3.0;
				}
				if (sourceNode && gainNode) {
					sourceNode.connect(gainNode);
					gainNode.connect(audioCtx.destination);
				}
				if (audioCtx.state === "suspended")
					audioCtx.resume().catch(() => {});
			} catch (e) {}
		}

		audioEl.play().catch(() => {});
	} catch (e) {}
}

export function stopAtrociousAudio() {
	try {
		if (audioEl) {
			audioEl.pause();
			audioEl.currentTime = 0;
		}
		try {
			if (gainNode) {
				gainNode.disconnect();
				gainNode = null;
			}
			if (sourceNode) {
				sourceNode.disconnect();
				sourceNode = null;
			}
			if (audioCtx) {
				audioCtx.suspend().catch(() => {});
			}
		} catch (e) {}
	} catch (e) {}
}

export function setAudioVolume(v: number) {
	try {
		if (gainNode) gainNode.gain.value = Math.max(0, v);
		if (audioEl) audioEl.volume = Math.max(0, Math.min(1, v));
	} catch (e) {}
}
