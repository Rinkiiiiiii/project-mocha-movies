import { signOutAction } from "@/actions/auth";
import { LogOut } from "lucide-react";

export default function SignOutButton() {
  return (
    <form action={signOutAction}>
      <button
        type="submit"
        className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-slate-300 transition hover:bg-base-800 hover:text-white"
      >
        <LogOut size={15} />
        Sign out
      </button>
    </form>
  );
}
