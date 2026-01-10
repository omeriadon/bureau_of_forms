"use client";
import { useEffect } from "react";

export default function RandomRefresh() {
	useEffect(() => {
		const min = 7_000;
		const max = 60_000;
		const delay = Math.random() * (max - min) + min;

		const id = setTimeout(() => {
			window.location.reload();
		}, delay);

		return () => clearTimeout(id);
	}, []);

	return null;
}
