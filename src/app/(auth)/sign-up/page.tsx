import type { Metadata } from "next";
import SignUpForm from "@/components/SignUpForm";

export const metadata: Metadata = { title: "Sign up" };

export default function SignUpPage() {
  return (
    <div className="container-page flex min-h-[70vh] items-center justify-center py-10">
      <div className="card-surface w-full max-w-sm p-8">
        <h1 className="mb-6 text-center text-xl font-bold text-white">
          Create your account
        </h1>
        <SignUpForm />
      </div>
    </div>
  );
}
