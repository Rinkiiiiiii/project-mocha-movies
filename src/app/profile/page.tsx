import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function ProfileIndexPage() {
  const session = await auth();
  if (session?.user) {
    redirect(`/profile/${session.user.username}`);
  }
  redirect("/sign-in");
}
