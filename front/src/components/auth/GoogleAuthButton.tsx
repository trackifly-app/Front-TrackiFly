"use client";
import { signIn } from "next-auth/react";

interface GoogleAuthButtonProps {
  mode?: "login" | "register";
}

export default function GoogleAuthButton({
  mode = "login",
}: GoogleAuthButtonProps) {
  const label =
    mode === "register" ? "Registrarse con Google" : "Continuar con Google";

  return (
    <>
      <div className="flex items-center gap-3 my-4">
        <div className="flex-1 h-px bg-border" />
        <span className="text-sm text-muted">o</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      <button
        type="button"
        onClick={() =>
          signIn("google", { callbackUrl: `/?googleMode=${mode}` })
        }
        className="w-full flex items-center justify-center gap-3 rounded-2xl border border-border bg-surface py-3 px-5 text-foreground hover:bg-surface-muted transition-all"
      >
        <svg width="20" height="20" viewBox="0 0 48 48">
          <path
            fill="#EA4335"
            d="M24 9.5c3.1 0 5.8 1.1 8 2.9l6-6C34.5 3.1 29.6 1 24 1 14.8 1 7 6.7 3.7 14.6l7 5.4C12.5 13.7 17.8 9.5 24 9.5z"
          />
          <path
            fill="#4285F4"
            d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.7c-.6 3-2.3 5.5-4.8 7.2l7.4 5.7c4.3-4 6.8-9.9 6.8-16.9z"
          />
          <path
            fill="#FBBC05"
            d="M10.7 28.6A14.5 14.5 0 0 1 9.5 24c0-1.6.3-3.2.8-4.6l-7-5.4A23.9 23.9 0 0 0 1 24c0 3.8.9 7.4 2.7 10.6l7-5.4z"
          />
          <path
            fill="#34A853"
            d="M24 47c5.4 0 10-1.8 13.3-4.8l-7.4-5.7c-1.8 1.2-4.1 1.9-5.9 1.9-6.2 0-11.5-4.2-13.3-9.9l-7 5.4C7 41.3 14.8 47 24 47z"
          />
        </svg>
        {label}
      </button>
    </>
  );
}
