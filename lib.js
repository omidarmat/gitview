import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { Octokit } from "octokit";

const key = new TextEncoder().encode(process.env.ENCRYPT_SECRET);

export async function encrypt(payload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("10 min from now")
    .sign(key);
}

export async function decrypt(input) {
  try {
    const { payload } = await jwtVerify(input, key, { algorithms: ["HS256"] });
    if (payload) return payload;
  } catch (err) {
    return false;
  }
}

export async function validateSession() {
  const cookieStore = cookies();
  const session = cookieStore.get("gitview-session");

  const payload = await decrypt(session.value);
  return payload.accessToken;
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
    const accessToken = await validateSession();
    // 3.1. if cookie valid redirect to /repos
    if (accessToken) return accessToken;
    // 3.2. if cookie invalid delete cookie and render login
    if (!accessToken) {
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

export async function getUsername(accessToken) {
  const resUser = await fetch("https://api.github.com/user", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    },
    next: { revalidate: 10 },
  });
  const user = await resUser.json();
  const usernameObj = {
    username: user.login,
    fullname: user.name,
  };
  return usernameObj;
}

export async function getRepos(accessToken, username, perPage, page) {
  const octokit = new Octokit({
    auth: accessToken,
  });

  const octokitRes = await octokit.request(
    `GET /users/{username}/repos?type=all`,
    {
      username,
      headers: { accept: "application/vnd.github+json" },
    }
  );
  console.log("OCTOKIT RESPONSE>>>>>>>>>>>>>");
  console.log(octokitRes);
  return octokitRes.data;
}

// GET /users/{username}/repos?type=all&per_page=${perPage}&page=${page}
