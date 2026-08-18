"use client";

import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";

import { signUpAction } from "@/actions/auth";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-primary w-full">
      {pending ? "Creating account..." : "Create account"}
    </button>
  );
}

export default function SignUpForm() {
  const [error, formAction] = useFormState(signUpAction, undefined);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="name" className="label-field">
          Display name (optional)
        </label>
        <input id="name" name="name" type="text" className="input-field" />
      </div>

      <div>
        <label htmlFor="username" className="label-field">
          Username
        </label>
        <input
          id="username"
          name="username"
          type="text"
          required
          minLength={3}
          maxLength={20}
          pattern="[a-zA-Z0-9_]+"
          title="Letters, numbers, and underscores only"
          className="input-field"
        />
      </div>

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
          minLength={8}
          className="input-field"
        />
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <SubmitButton />

      <p className="text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link href="/sign-in" className="font-medium text-accent-soft hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
