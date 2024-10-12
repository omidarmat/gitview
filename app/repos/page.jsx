import { checkSession, getRepos, getUsername } from "@/lib";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Octokit } from "octokit";

async function Repos() {
  let repos;
  let userFullname;

  const accessToken = await checkSession();

  if (!accessToken) redirect("/");
  if (accessToken) {
    const octokit = new Octokit({
      auth: accessToken,
    });

    const { username, fullname } = await getUsername(accessToken);
    userFullname = fullname;
    const octokitRes = await octokit.request(
      `GET /users/{username}/repos?type=all&per_page=2&page=2`,
      {
        username,
        headers: { accept: "application/vnd.github+json" },
      }
    );
    repos = octokitRes.data;

    // repos = await getRepos(accessToken, username);
  }
  return (
    <div>
      {!repos && <div>Something went wrong!</div>}
      {repos && (
        <div>
          <p>{userFullname}'s repositories</p>
          {repos.map((repo) => (
            <div key={repo.id}>
              <div>---Repo START---</div>
              <p>repo name: {repo.name}</p>
              <p>Last update: {repo.updated_at}</p>
              <p>owner: {repo.owner.login}</p>
              <p>download: {repo.downloads_url}</p>
              <div>---Repo END---</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Repos;
