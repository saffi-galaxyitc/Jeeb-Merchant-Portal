import { NextResponse } from "next/server";

export function middleware(request) {
  // Get the pathname of the request
  const { pathname } = request.nextUrl;

  // Define protected routes
  const protectedRoutes = ["/design", "/products", "/settings"];

  // Check if the current route is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute) {
    // Check for authentication token/flag in cookies or headers
    const authenticated = request.cookies.get("authenticated")?.value;

    // If not authenticated, redirect to signin
    if (!authenticated || authenticated === "false") {
      return NextResponse.redirect(new URL("/signin", request.url));
    }
  }

  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: ["/design/:path*", "/products/:path*", "/settings/:path*"],
};
