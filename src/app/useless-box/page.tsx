"use client";
import React from "react";
import "../../styles/page.css";

export default function UselessBox() {
	const [closed, setClosed] = React.useState(false);
	React.useEffect(() => {
		if (closed) return;
		const t = setTimeout(() => setClosed(true), 3000);
		return () => clearTimeout(t);
	}, [closed]);
	return (
		<div style={{ padding: 40 }}>
			<h2>Useless Box</h2>
			<div
				onClick={() => setClosed(true)}
				style={{
					width: 200,
					height: 200,
					background: "linear-gradient(45deg,#ff6,#f6f)",
					marginTop: 24,
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					cursor: "pointer",
				}}
			>
				{closed ? <span>Closed</span> : <span>Click me</span>}
			</div>
		</div>
	);
}
