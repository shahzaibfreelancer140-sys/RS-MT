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

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Protect dashboard
  if (pathname.startsWith("/dashboard")) {
    const authenticated = await isAuthenticated(request);

    if (!authenticated) {
      return NextResponse.redirect(
        new URL("/login", request.url)
      );
    }
  }

  // Protect admin create/edit pages
  const protectedPages = [
    "/movies/new",
    "/movies/edit",
    "/tvshows/new",
    "/tvshows/edit",
  ];

  const needsProtection = protectedPages.some((path) =>
    pathname.startsWith(path)
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
  ],
};