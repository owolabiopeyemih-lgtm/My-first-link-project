import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl, auth: session } = req;
  const isLoggedIn = !!session;

  const isDashboard = nextUrl.pathname.startsWith("/dashboard");
  const isOnboarding = nextUrl.pathname.startsWith("/onboarding");
  const isAuthPage = ["/login", "/signup"].some((p) => nextUrl.pathname.startsWith(p));

  if ((isDashboard || isOnboarding) && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  if (isAuthPage && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip static files and API routes that don't need auth
    "/((?!_next/static|_next/image|favicon.ico|api/auth|api/analytics|api/payments).*)",
  ],
};
