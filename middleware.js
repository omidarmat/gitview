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

  if (code && state === process.env.STATE) {
    const response = NextResponse.next();
    const returnedResponse = await setSession(response, code);
    return returnedResponse;
  }

  if (!code) {
    const result = await checkSession();
    if (!result) {
      const response = NextResponse.next();
      const returnedResponse = await removeSession(response);
      return returnedResponse;
    } else {
      return;
    }
  }
}

export const config = {
  matcher: "/",
};
