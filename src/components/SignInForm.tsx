"use client";

import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";

import { signInAction } from "@/actions/auth";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-primary w-full">
      {pending ? "Signing in..." : "Sign in"}
    </button>
  );
}

export default function SignInForm() {
  const [error, formAction] = useFormState(signInAction, undefined);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="email" className="label-field">
          Email
        </label>
        <input id="email" name="email" type="email" required className="input-field" />
      </div>

      <div>
        <label htmlFor="password" className="label-field">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="input-field"
        />
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <SubmitButton />

      <p className="text-center text-sm text-slate-500">
        No account yet?{" "}
        <Link href="/sign-up" className="font-medium text-accent-soft hover:underline">
          Sign up
        </Link>
      </p>
    </form>
  );
}
