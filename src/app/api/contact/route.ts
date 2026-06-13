import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("/api/contact", body);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
