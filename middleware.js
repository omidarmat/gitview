import { NextResponse } from "next/server";
import { getToken } from "./lib";

export default async function middleware(request) {
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");

  if (code && state === process.env.STATE) {
    const accessToken = getToken(code);
    const response = NextResponse.next();
    response.cookies.set("gitview-session", accessToken, { httpOnly: true });
    return response;
  }
}

export const config = {
  matcher: "/auth",
};
