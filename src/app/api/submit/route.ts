import { NextResponse } from "next/server";

export async function POST(req: Request) {
	try {
		const body = await req.json().catch(() => ({}));
		const ok = Math.random() < 0.6;
		const id = Math.floor(Math.random() * 1e6).toString(36);
		const msg = ok
			? `Submission received. Reference: ${id}`
			: `Your submission may have been recorded under ${id} (status unknown)`;
		return NextResponse.json({ message: msg, ambiguous: !ok });
	} catch (e) {
		return NextResponse.json(
			{ message: "Service error: your request is queued for review." },
			{ status: 500 },
		);
	}
}
