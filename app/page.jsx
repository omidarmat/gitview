import { checkSession } from "@/lib";

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

  const sessionChecked = await checkSession();
  if (sessionChecked) redirect("/repos");
  return JSX;
}
