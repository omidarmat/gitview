import { cookies } from "next/headers";
import Link from "next/link";

export default async function Home() {
  const cookieStore = cookies();
  const session = cookieStore.get("gitview-session");

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
      {session && <p>Loading your repos...</p>}
    </div>
  );
}
