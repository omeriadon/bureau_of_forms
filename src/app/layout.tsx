import type { Metadata } from "next";
import "./globals.css";
import RandomRefresh from "@/components/RandomRefresh";

export const metadata: Metadata = {
	title: "Bureau Of Forms",
	description: "good luck submitting",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<RandomRefresh />
			<body>{children}</body>
		</html>
	);
}
