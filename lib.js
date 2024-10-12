import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const key = new TextEncoder().encode(process.env.ENCRYPT_SECRET);

export async function encrypt(payload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("10 sec from now")
    .sign(key);
}

export async function decrypt(input) {
  try {
    const { payload } = await jwtVerify(input, key, { algorithms: ["HS256"] });
    if (payload) return true;
  } catch (err) {
    return false;
  }
}

export async function validateSession() {
  const cookieStore = cookies();
  const session = cookieStore.get("gitview-session");

  const sessionIsValid = await decrypt(session.value);
  return sessionIsValid;
}

export async function checkSession() {
  // 1. search for gitview-session cookie
  const cookieStore = cookies();
  const session = cookieStore.get("gitview-session");
  // 2. if no cookie, render login
  if (!session) {
    return false;
  }
  // 3. if cookie exists, validate cookie
  if (session) {
    const sessionIsValid = await validateSession();
    // 3.1. if cookie valid redirect to /repos
    if (sessionIsValid) return true;
    // 3.2. if cookie invalid delete cookie and render login
    if (!sessionIsValid) {
      return false;
    }
  }
}

export async function createSession(code) {
  const res = await fetch(
    `https://github.com/login/oauth/access_token?client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&code=${code}`,
    {
      next: { revalidate: 0 },
      method: "POST",
      headers: { Accept: "application/json" },
    }
  );
  const data = await res.json();
  const accessToken = data.access_token;
  const session = {
    accessToken,
  };
  const encryptedSession = encrypt(session);

  return encryptedSession;
}
