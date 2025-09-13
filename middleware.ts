
import { type NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";

export const config = {
  matcher: ["/dashboard/:path*"],
};

export async function middleware(request: NextRequest) {
  const session = await getSession(request);

  if (!session) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
