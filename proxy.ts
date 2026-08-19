import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secret = process.env.AUTH_SECRET;

if (!secret) {
  throw new Error("AUTH_SECRET is missing");
}

const secretKey = new TextEncoder().encode(secret);

async function isAuthenticated(request: NextRequest) {
  const token = request.cookies.get("admin_session")?.value;

  if (!token) {
    return false;
  }

  try {
    await jwtVerify(token, secretKey);
    return true;
  } catch {
    return false;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const protectedPages = [
    "/dashboard",
    "/movies/new",
    "/movies/edit",
    "/tvshows/new",
    "/tvshows/edit",
    "/seasons/new",
    "/seasons/edit",
    "/episodes/new",
    "/episodes/edit",
  ];

  const needsProtection = protectedPages.some((path) =>
    pathname === path || pathname.startsWith(`${path}/`)
  );

  if (needsProtection) {
    const authenticated = await isAuthenticated(request);

    if (!authenticated) {
      return NextResponse.redirect(
        new URL("/login", request.url)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/movies/new/:path*",
    "/movies/edit/:path*",
    "/tvshows/new/:path*",
    "/tvshows/edit/:path*",
    "/seasons/new/:path*",
    "/seasons/edit/:path*",
    "/episodes/new/:path*",
    "/episodes/edit/:path*",
  ],
};