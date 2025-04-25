import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const authHeader = req.headers.get("authorization");

  // Redirect /chat to /chat-history
  if (url.pathname === "/dashboard/chat") {
    return NextResponse.redirect(new URL("/dashboard/chat-history", req.url));
  }

  // If the request is not for authentication-protected routes, proceed
  if (!url.pathname.startsWith("/api/users/chat")) {
    return NextResponse.next();
  }

  // Authentication logic for API routes
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];

  try {
    const secret = new TextEncoder().encode(process.env.JWT_TOKEN_SECRET);
    const { payload } = await jwtVerify(token, secret); // Verify JWT

    if (!payload.id) {
      return NextResponse.json({ error: "Invalid Token" }, { status: 401 });
    }

    const requestHeaders = new Headers(req.headers);
    console.log(payload.id)
    requestHeaders.set("x-user-id", payload.id as string);

    return NextResponse.next({
      request: {
        headers: requestHeaders, // Pass modified headers
      },
    });
  } catch (error) {
    console.log("JWT Verification Error:", error);
    return NextResponse.json({ error: "Invalid Token" }, { status: 401 });
  }
}

export const config = {
  matcher: ["/api/users/chat", "/dashboard/chat", "/api/users/agent"],
};
