import { checkSession, getRepos } from "@/lib";
import Image from "next/image";
import { redirect } from "next/navigation";

const resultPerPage = 3;

async function Repos({ searchParams }) {
  let repos;
  let numPages;

  if (!searchParams.p) redirect("/repos?p=1");
  const currentPage = searchParams.p;

  const result = await checkSession();

  if (!result) redirect("/");

  const {
    accessToken,
    user: { username, fullname },
  } = result;

  repos = await getRepos(accessToken, username, resultPerPage, currentPage);
  numPages = Math.floor(repos.length / resultPerPage) + 1;

  return (
    <>
      <header className="flex items-center justify-between mb-7">
        <div className="flex gap-2 items-center">
          <Image
            src="/gitview-logo.png"
            height={45}
            width={45}
            alt="Gitview logo"
          />
          <div>
            <h1 className="font-bold text-lg text-text-heading">Gitview</h1>
            <p className="text-xs">v 1.0.0</p>
          </div>
        </div>

        <a href="/?logout=1" className="icon-button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="size-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
            />
          </svg>
          <p>Logout</p>
        </a>
      </header>
      <main className="flex flex-col h-[94vh]">
        {!repos && <div>Something went wrong!</div>}
        {repos && (
          <div className="text-text-normal mb-10">
            <div className="mb-5">
              <h2 className="text-text-heading text-lg font-semibold">
                {fullname}&#39;s repositories
              </h2>
              <p className="text-sm">
                Found{" "}
                <span className="text-primary-400 font-semibold">
                  {repos.length}
                </span>{" "}
                public repositories
              </p>
            </div>
            <div className="flex flex-col gap-2 mb-7">
              {repos.map((repo, i) => {
                if (
                  i >= currentPage * resultPerPage - resultPerPage &&
                  i <= currentPage * resultPerPage - 1
                )
                  return (
                    <div
                      key={repo.id}
                      className="bg-primary-100 rounded-xl px-5 py-4"
                    >
                      <div className="flex items-start mb-4">
                        <div>
                          <h3 className="font-semibold mb-1 text-lg">
                            {repo.name}
                          </h3>
                          <div className="flex gap-2 items-center">
                            <Image
                              src={repo.owner.avatar_url}
                              alt="user avatar"
                              width={35}
                              height={35}
                              className="rounded-full"
                            />
                            <p className="font-semibold text-sm">
                              <span className="text-xs">owned by</span>{" "}
                              {repo.owner.login}
                            </p>
                          </div>
                        </div>

                        <a
                          href={`https://codeload.github.com/${repo.owner.login}/${repo.name}/zip/refs/heads/main`}
                          className="flex items-center gap-2 bg-primary-700 px-3 py-2 rounded-xl text-primary-100 text-sm font-bold"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="size-4"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                            />
                          </svg>
                          <p>Download</p>
                        </a>
                      </div>
                      <div className="flex gap-1 items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          className="size-4 stroke-primary-400"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                          />
                        </svg>

                        <p className="text-xs">
                          Last update:{" "}
                          {new Date(repo.updated_at).toDateString()}
                        </p>
                      </div>
                    </div>
                  );
              })}
            </div>
            <div className="flex items-center justify-between">
              {currentPage > 1 ? (
                <form
                  action={async () => {
                    "use server";
                    await getRepos(
                      accessToken,
                      username,
                      resultPerPage,
                      +currentPage - 1
                    );
                    redirect(`/repos?p=${+currentPage - 1}`);
                  }}
                >
                  <button type="submit" className="icon-button">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
                      />
                    </svg>
                    <p>page {+currentPage - 1}</p>
                  </button>
                </form>
              ) : null}

              <p className="text-sm">
                Page{" "}
                <span className="text-primary-400 font-bold">
                  {currentPage}
                </span>{" "}
                of {numPages}
              </p>

              {currentPage < numPages ? (
                <form
                  action={async () => {
                    "use server";
                    await getRepos(
                      accessToken,
                      username,
                      resultPerPage,
                      +currentPage + 1
                    );
                    redirect(`/repos?p=${+currentPage + 1}`);
                  }}
                >
                  <button type="submit" className="icon-button">
                    <p>page {+currentPage + 1}</p>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                      />
                    </svg>
                  </button>
                </form>
              ) : null}
            </div>
          </div>
        )}
        <p className="text-center text-xs mt-auto pb-8">
          &copy;Copyright 2024 by Omid Armat
        </p>
      </main>
    </>
  );
}

export default Repos;
