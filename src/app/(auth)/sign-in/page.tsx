import type { Metadata } from "next";
import SignInForm from "@/components/SignInForm";

export const metadata: Metadata = { title: "Sign in" };

export default function SignInPage() {
  return (
    <div className="container-page flex min-h-[70vh] items-center justify-center">
      <div className="card-surface w-full max-w-sm p-8">
        <h1 className="mb-6 text-center text-xl font-bold text-white">
          Welcome back
        </h1>
        <SignInForm />
      </div>
    </div>
  );
}
