import { NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { sessionOptions } from "./lib/session";

export async function middleware(request) {
  const cookieHeader = request.headers.get("cookie") || "";
  const fakeRequest = {
    headers: {
      cookie: cookieHeader,
    },
  };

  const session = await getIronSession(fakeRequest, {}, sessionOptions);
  const url = request.nextUrl.clone();

  if (url.pathname.startsWith("/member")) {
    if (!session?.user || session.user.role !== "user") {
      url.pathname = "/common/home";
      return NextResponse.redirect(url);
    }
  } else if (url.pathname.startsWith("/admin")) {
    if (!session?.user || session.user.role !== "admin") {
      url.pathname = "/common/home";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/member/:path*", "/admin/:path*"],
};
