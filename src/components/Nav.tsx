"use client";

import { UserProfile } from "@/lib/api";

const API = process.env.NEXT_PUBLIC_API_URL ?? "https://api.formsend.ezeroandone.io";

interface NavProps {
  user: UserProfile | null;
}

export function Nav({ user }: NavProps) {
  return (
    <nav className="nav">
      <a href="/" className="nav-brand">FormSend</a>
      <div className="nav-links">
        <a href="/docs" className="nav-link">Docs</a>
        <a href="/pricing" className="nav-link">Pricing</a>
        {user ? (
          <>
            {/* divider */}
            <span style={{ width: 1, height: 18, background: "var(--border)", display: "inline-block", margin: "0 0.25rem" }} aria-hidden="true" />
            <a href="/dashboard" className="nav-link">Dashboard</a>
            {user.is_admin && <a href="/admin" className="nav-link">Admin</a>}
            <form action={`${API}/auth/logout`} method="POST" style={{ display: "inline" }}>
              <button type="submit" className="btn-ghost btn-sm">Sign out</button>
            </form>
          </>
        ) : (
          <>
            {/* divider */}
            <span style={{ width: 1, height: 18, background: "var(--border)", display: "inline-block", margin: "0 0.25rem" }} aria-hidden="true" />
            <a href={`${API}/auth/google`} className="btn-primary btn-sm">
              Sign in
            </a>
          </>
        )}
      </div>
    </nav>
  );
}
