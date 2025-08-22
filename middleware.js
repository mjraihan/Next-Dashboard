import { NextResponse } from "next/server";

export function middleware(request) {
  return new NextResponse(
    `Middleware aktif untuk: ${request.nextUrl.pathname}`,
    { status: 200 }
  );
}

export const config = {
  matcher: "/:path*",
};
