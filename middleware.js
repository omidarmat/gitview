import { NextResponse } from "next/server";
import { checkSession, createSession } from "./lib";

async function setSession(response, code) {
  const encryptedSession = await createSession(code);
  response.cookies.set("gitview-session", encryptedSession, {
    httpOnly: true,
  });

  return response;
}

async function removeSession(response) {
  response.cookies.delete("gitview-session");
  return response;
}

export default async function middlware(request) {
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const logout = request.nextUrl.searchParams.get("logout");
  const response = NextResponse.next();
  if (code && state === process.env.STATE) {
    const returnedResponse = await setSession(response, code);
    return returnedResponse;
  }

  if (!code && !logout) {
    const result = await checkSession();
    if (!result) {
      const returnedResponse = await removeSession(response);
      return returnedResponse;
    } else {
      return;
    }
  }

  if (logout === "1") {
    console.log(">>>>>>>>>>>>>>LOGOUT ACTIVATED");
    const returnedResponse = await removeSession(response);
    return returnedResponse;
  }
}

export const config = {
  matcher: "/",
};
