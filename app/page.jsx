import { checkSession } from "@/lib";
import Image from "next/image";

import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Home() {
  const JSX = (
    <main>
      <div className="bg-primary-100 my-auto px-5 pt-12 py-7 flex flex-col gap-2 items-center text-center rounded-2xl max-h-dvh">
        <Image
          src="/gitview-logo.png"
          width={100}
          height={100}
          alt="Gitview logo"
          className="mb-5"
        />
        <h1 className="text-xl font-bold text-text-heading">Gitview</h1>
        <p className="text-sm text-text-heading">
          View all your repositories key information in one clean view.
        </p>
        <p className="mt-10 mb-2 text-sm font-bold text-text-heading">
          Please login to your account
        </p>
        <Link
          href={`https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}&state=${process.env.STATE}`}
          className="bg-primary-700 text-primary-100 px-6 py-2 rounded-lg mb-10"
        >
          Login with github
        </Link>
        <div className="flex flex-col gap-1 text-xs">
          <p>Gitview 1.0.0</p>
          <p>&copy;copyright 2024 by Omid Armat</p>
        </div>
      </div>
    </main>
  );

  const result = await checkSession();
  if (result) redirect("/repos");
  return JSX;
}
