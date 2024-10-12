import { checkSession } from "@/lib";
import { redirect } from "next/navigation";

async function Repos() {
  const sessionChecked = await checkSession();

  if (sessionChecked) return <div>Loading your repos...</div>;
  if (!sessionChecked) redirect("/");
}

export default Repos;
