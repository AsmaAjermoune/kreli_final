import { NextRequest, NextResponse } from "next/server";

const LOCALES = ["fr", "en", "ar"] as const;
type Locale = (typeof LOCALES)[number];

function isLocale(s: string): s is Locale {
  return (LOCALES as readonly string[]).includes(s);
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/uploads") ||
    /\.(.+)$/.test(pathname)
  ) {
    return NextResponse.next();
  }

  
  const firstSegment = pathname.split("/")[1];

  if (isLocale(firstSegment)) {
    
    const rewrittenPath = pathname.slice(firstSegment.length + 1) || "/";
    const url = request.nextUrl.clone();
    url.pathname = rewrittenPath;

    const response = NextResponse.rewrite(url);
    
    response.cookies.set("locale", firstSegment, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
    return response;
  }

  
  
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
