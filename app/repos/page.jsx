import { checkSession, getRepos, getUsername } from "@/lib";
import { redirect } from "next/navigation";

async function Repos() {
  let repos;
  let userFullname;

  const accessToken = await checkSession();

  if (!accessToken) redirect("/");
  if (accessToken) {
    const { username, fullname } = await getUsername(accessToken);
    userFullname = fullname;

    repos = await getRepos(accessToken, username, 2, 1);
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
