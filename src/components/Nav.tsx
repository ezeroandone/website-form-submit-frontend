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
        <a href="/pricing">Pricing</a>
        {user ? (
          <>
            <a href="/dashboard">Dashboard</a>
            {user.is_admin && <a href="/admin">Admin</a>}
            <form action={`${API}/auth/logout`} method="POST" style={{ display: "inline" }}>
              <button type="submit" className="btn-ghost btn-sm">Sign out</button>
            </form>
          </>
        ) : (
          <a href={`${API}/auth/google`} className="btn-primary" style={{ padding: "0.4rem 1rem", borderRadius: 8, background: "#C5A059", color: "#000", fontWeight: 700, fontSize: "0.9rem" }}>
            Sign in
          </a>
        )}
      </div>
    </nav>
  );
}
