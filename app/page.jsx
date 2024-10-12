import { deleteSession, validateSession } from "@/lib";

import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Home() {
  const JSX = (
    <>
      <p>please log in to see your repos</p>
      <Link
        href={`https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}&state=${process.env.STATE}`}
      >
        Login with github
      </Link>
    </>
  );
  // 1. search for gitview-session cookie
  const cookieStore = cookies();
  let session = cookieStore.get("gitview-session");
  // 2. if no cookie, render login
  if (!session) {
    return JSX;
  }
  // 2. if cookie exists, validate cookie
  if (session) {
    const sessionIsValid = await validateSession(session);
    // 3. if cookie valid redirect to /repos
    if (sessionIsValid) redirect("/repos");
    // 4. if cookie invalid delete cookie and render login
    if (!sessionIsValid) {
      return JSX;
    }
  }
}
