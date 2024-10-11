import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Home() {
  const cookieStore = cookies();
  const session = cookieStore.get("gitview-session");

  // TODO validate session
  if (session) redirect("/repos");

  return (
    <div>
      {!session && (
        <>
          <p>please log in to see your repos</p>
          <Link
            href={`https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}&state=${process.env.STATE}`}
          >
            Login with github
          </Link>
        </>
      )}
    </div>
  );
}
