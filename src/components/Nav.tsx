"use client";

import { useState, useEffect } from "react";
import { UserProfile } from "@/lib/api";

const API = process.env.NEXT_PUBLIC_API_URL ?? "https://api.formsend.ezeroandone.io";

interface NavProps {
  user: UserProfile | null;
}

export function Nav({ user }: NavProps) {
  const [open, setOpen] = useState(false);

  // Close drawer on route changes or Escape key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <nav className="nav">
        <a href="/" className="nav-brand">FormSend</a>

        {/* Desktop links */}
        <div className="nav-links">
          <a href="/docs" className="nav-link">Docs</a>
          <a href="/pricing" className="nav-link">Pricing</a>
          {user ? (
            <>
              <span style={{ width: 1, height: 18, background: "var(--border)", display: "inline-block", margin: "0 0.25rem" }} aria-hidden="true" />
              <a href="/dashboard" className="nav-link">Dashboard</a>
              {user.is_admin && <a href="/admin" className="nav-link">Admin</a>}
              <form
                action={`${API}/auth/logout`}
                method="POST"
                style={{ display: "inline" }}
                onSubmit={() => sessionStorage.removeItem("fs_user")}
              >
                <button type="submit" className="btn-ghost btn-sm">Sign out</button>
              </form>
            </>
          ) : (
            <>
              <span style={{ width: 1, height: 18, background: "var(--border)", display: "inline-block", margin: "0 0.25rem" }} aria-hidden="true" />
              <a href={`${API}/auth/google`} className="btn-primary btn-sm">Sign in</a>
            </>
          )}
        </div>

        {/* Hamburger — mobile only */}
        <button
          className="nav-hamburger"
          aria-label="Open navigation menu"
          aria-expanded={open}
          onClick={() => setOpen(true)}
        >
          <span className="material-icons-round">menu</span>
        </button>
      </nav>

      {/* Overlay */}
      <div
        className={`nav-drawer-overlay${open ? " open" : ""}`}
        aria-hidden="true"
        onClick={() => setOpen(false)}
      />

      {/* Drawer */}
      <nav className={`nav-drawer${open ? " open" : ""}`} aria-label="Mobile navigation">
        <div className="nav-drawer-header">
          <a href="/" className="nav-brand" onClick={() => setOpen(false)}>FormSend</a>
          <button
            className="nav-drawer-close"
            aria-label="Close navigation menu"
            onClick={() => setOpen(false)}
          >
            <span className="material-icons-round">close</span>
          </button>
        </div>

        <a href="/docs" className="nav-link" onClick={() => setOpen(false)}>Docs</a>
        <a href="/pricing" className="nav-link" onClick={() => setOpen(false)}>Pricing</a>

        {user ? (
          <>
            <div className="nav-drawer-divider" />
            <a href="/dashboard" className="nav-link" onClick={() => setOpen(false)}>Dashboard</a>
            {user.is_admin && (
              <a href="/admin" className="nav-link" onClick={() => setOpen(false)}>Admin</a>
            )}
            <div className="nav-drawer-divider" />
            <form
              action={`${API}/auth/logout`}
              method="POST"
              className="nav-drawer-sign-out-form"
              onSubmit={() => sessionStorage.removeItem("fs_user")}
            >
              <button type="submit" className="btn-ghost btn-sm">Sign out</button>
            </form>
          </>
        ) : (
          <>
            <div className="nav-drawer-divider" />
            <a href={`${API}/auth/google`} className="btn-primary btn-sm">Sign in</a>
          </>
        )}
      </nav>
    </>
  );
}
