import { NextResponse } from "next/server";

const DASHBOARD_PASSWORD = "orla-dash-2026";

export async function POST(request: Request) {
  const { password } = await request.json();

  if (password === DASHBOARD_PASSWORD) {
    const response = NextResponse.json({ ok: true });
    response.cookies.set("orla-auth", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    });
    return response;
  }

  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
