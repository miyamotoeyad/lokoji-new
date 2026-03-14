import { NextResponse } from "next/server";

// Client-safe endpoint — called by the hook on manual refresh
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const base = searchParams.get("base") ?? "USD";

  try {
    const res = await fetch(`https://open.er-api.com/v6/latest/${base}`, {
      next: { revalidate: 86400 },
    });
    if (!res.ok) throw new Error("API failed");
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "تعذّر تحميل الأسعار" }, { status: 500 });
  }
}