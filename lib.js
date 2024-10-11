export async function getToken(code) {
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
  // TODO build session data
  // TODO encrypt session data and return
  return accessToken;
}
