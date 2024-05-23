import { NextResponse } from "next/server";
import {
  checkIsAdminByCookies,
  checkIsUserByCookies,
} from "./lib/cookiesUtils";

export function middleware(request) {
  const pathname = request.nextUrl.pathname;
  const isAdmin = checkIsAdminByCookies();
  const isUser = checkIsUserByCookies();

  // Two conditions to check that we are on admin route and not on admin-login route
  if (pathname.startsWith("/admin/") || pathname === "/admin") {
    if (!isAdmin) {
      return NextResponse.redirect(new URL("/admin-login", request.url));
    }
  }

  if (pathname.startsWith("/admin-login")) {
    if (isAdmin) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  if (pathname.startsWith("/me")) {
    if (!isUser) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  if (pathname.startsWith("/login") || pathname.startsWith("/signup")) {
    if (isUser) {
      return NextResponse.redirect(new URL("/me", request.url));
    }
  }

  if (pathname.startsWith("/api")) {
    // console.log("[middleware] Access Cookie: ", request.cookies.get("access-token"));
    /*
    // Access to local storage is not allowed
    console.log(
      `${pathname} - Authorisation: `,
      request.headers.get("authorization")
    );
    // console.log("Request Headers ->", request.headers);
    const requestHeaders = new Headers(request.headers);
    console.log(
      "[MIDDELWARE] X-CUSTOM-HEADER: ",
      requestHeaders.get("authorization")
    );
    requestHeaders.append("x-custom-header", "custom-header-value");

    return NextResponse.next({
      request: {
        ...request,
        headers: requestHeaders,
      },
    });
    */
  }

  return NextResponse.next();
}
