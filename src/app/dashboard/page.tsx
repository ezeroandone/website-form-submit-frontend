"use client";

import { useEffect, useState } from "react";
import {
  getMe,
  listWebsites,
  createWebsite,
  deleteWebsite,
  rotateKey,
  resendVerification,
  UserProfile,
  WebsiteRecord,
  CreateWebsiteResult,
  GOOGLE_LOGIN_URL,
} from "@/lib/api";
import { Nav } from "@/components/Nav";
import { KeyReveal } from "@/components/KeyReveal";

export default function DashboardPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [websites, setWebsites] = useState<WebsiteRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Add website form
  const [domain, setDomain] = useState("");
  const [notifyEmail, setNotifyEmail] = useState("");
  const [addError, setAddError] = useState("");
  const [adding, setAdding] = useState(false);

  // Key reveal state
  const [revealedKey, setRevealedKey] = useState<{ key: string; domain: string } | null>(null);

  // Action states
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [rotatingId, setRotatingId] = useState<string | null>(null);
  const [resendingId, setResendingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState("");
  const [actionSuccess, setActionSuccess] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const profile = await getMe();
        if (!profile) { window.location.href = GOOGLE_LOGIN_URL; return; }
        setUser(profile);
        const sites = await listWebsites();
        setWebsites(sites);
      } catch {
        window.location.href = "/";
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleAddWebsite(e: React.FormEvent) {
    e.preventDefault();
    setAddError("");
    setAdding(true);
    try {
      const result: CreateWebsiteResult = await createWebsite(domain.trim(), notifyEmail.trim());
      setWebsites((prev) => [{
        id: result.website_id,
        domain: result.domain,
        notify_email: result.notify_email,
        email_verified: 0,
        created_at: result.created_at,
      }, ...prev]);
      setRevealedKey({ key: result.api_key, domain: result.domain });
      setDomain("");
      setNotifyEmail("");
    } catch (err: unknown) {
      setAddError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setAdding(false);
    }
  }

  async function handleDelete(site: WebsiteRecord) {
    if (!confirm(`Delete ${site.domain}? This cannot be undone.`)) return;
    setDeleteId(site.id);
    setActionError("");
    try {
      await deleteWebsite(site.id);
      setWebsites((prev) => prev.filter((w) => w.id !== site.id));
    } catch (err: unknown) {
      setActionError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeleteId(null);
    }
  }

  async function handleRotate(site: WebsiteRecord) {
    if (!confirm(`Rotate API key for ${site.domain}? The current key will be invalidated immediately.`)) return;
    setRotatingId(site.id);
    setActionError("");
    try {
      const result = await rotateKey(site.id);
      setRevealedKey({ key: result.api_key, domain: site.domain });
    } catch (err: unknown) {
      setActionError(err instanceof Error ? err.message : "Rotation failed");
    } finally {
      setRotatingId(null);
    }
  }

  async function handleResend(site: WebsiteRecord) {
    setResendingId(site.id);
    setActionError("");
    setActionSuccess("");
    try {
      await resendVerification(site.id);
      setActionSuccess(`Verification email resent to ${site.notify_email}`);
    } catch (err: unknown) {
      setActionError(err instanceof Error ? err.message : "Resend failed");
    } finally {
      setResendingId(null);
    }
  }

  if (loading) return <div style={{ padding: "4rem", textAlign: "center", color: "var(--muted)" }}>Loading…</div>;

  if (!user) return (
    <div style={{ padding: "4rem", textAlign: "center" }}>
      <p style={{ marginBottom: "1rem" }}>You need to sign in.</p>
      <a href={GOOGLE_LOGIN_URL} style={{ padding: "0.6rem 1.5rem", borderRadius: 8, background: "#C5A059", color: "#000", fontWeight: 700 }}>
        Sign in with Google
      </a>
    </div>
  );

  const atLimit = !user.is_admin && user.website_count >= user.slot_count;

  return (
    <>
      <Nav user={user} />
      <main className="container">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem", marginBottom: "2rem" }}>
          <div>
            <h1 className="page-title">Dashboard</h1>
            <p className="page-sub">
              Hi {user.name} · {user.website_count} / {user.is_admin ? "∞" : user.slot_count} websites used
              {user.is_admin && <span className="badge badge-gold" style={{ marginLeft: "0.5rem" }}>Admin</span>}
            </p>
          </div>
          {atLimit && (
            <a href="/pricing" style={{ display: "inline-block", background: "#C5A059", color: "#000", fontWeight: 700, padding: "0.5rem 1.25rem", borderRadius: 8, fontSize: "0.9rem" }}>
              Upgrade to add more →
            </a>
          )}
        </div>

        {/* Add website form */}
        {!atLimit && (
          <div className="card" style={{ marginBottom: "2rem" }}>
            <h2 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "1rem" }}>Add a website</h2>
            <form onSubmit={handleAddWebsite} style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                <input
                  type="text"
                  placeholder="Domain — e.g. mysite.com"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  style={{ flex: "1 1 200px" }}
                  required
                />
                <input
                  type="email"
                  placeholder="Notification email — e.g. you@example.com"
                  value={notifyEmail}
                  onChange={(e) => setNotifyEmail(e.target.value)}
                  style={{ flex: "1 1 220px" }}
                  required
                />
                <button type="submit" className="btn-primary" disabled={adding}>
                  {adding ? "Adding…" : "Add website"}
                </button>
              </div>
              <p style={{ fontSize: "0.8rem", color: "var(--muted)", margin: 0 }}>
                A verification email will be sent to the notification address before form submissions are accepted.
              </p>
              {addError && <p className="error-msg">{addError}</p>}
            </form>
          </div>
        )}

        {/* Key reveal */}
        {revealedKey && (
          <KeyReveal apiKey={revealedKey.key} domain={revealedKey.domain} onDismiss={() => setRevealedKey(null)} />
        )}

        {/* Action feedback */}
        {actionError && <p className="error-msg" style={{ marginBottom: "1rem" }}>{actionError}</p>}
        {actionSuccess && <p className="success-msg" style={{ marginBottom: "1rem" }}>{actionSuccess}</p>}

        {/* Websites list */}
        <div className="card">
          <h2 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "1.25rem" }}>
            Your websites ({websites.length})
          </h2>

          {websites.length === 0 ? (
            <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>No websites yet. Add one above to get started.</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table>
                <thead>
                  <tr>
                    <th>Domain</th>
                    <th>Notification email</th>
                    <th>Status</th>
                    <th>Added</th>
                    <th style={{ textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {websites.map((site) => (
                    <tr key={site.id}>
                      <td>
                        <code style={{ background: "transparent", border: "none", padding: 0 }}>{site.domain}</code>
                      </td>
                      <td style={{ fontSize: "0.875rem", color: "var(--muted)" }}>{site.notify_email}</td>
                      <td>
                        {site.email_verified ? (
                          <span className="badge badge-green">Verified</span>
                        ) : (
                          <span className="badge" style={{ background: "rgba(240,160,64,0.15)", color: "#f0a040" }}>Pending</span>
                        )}
                      </td>
                      <td style={{ color: "var(--muted)", fontSize: "0.875rem" }}>
                        {new Date(site.created_at).toLocaleDateString()}
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end", flexWrap: "wrap" }}>
                          {!site.email_verified && (
                            <button
                              className="btn-ghost btn-sm"
                              disabled={resendingId === site.id}
                              onClick={() => handleResend(site)}
                              title="Resend verification email"
                            >
                              {resendingId === site.id ? "Sending…" : "Resend email"}
                            </button>
                          )}
                          <button
                            className="btn-ghost btn-sm"
                            disabled={rotatingId === site.id}
                            onClick={() => handleRotate(site)}
                          >
                            {rotatingId === site.id ? "Rotating…" : "Rotate key"}
                          </button>
                          <button
                            className="btn-danger btn-sm"
                            disabled={deleteId === site.id}
                            onClick={() => handleDelete(site)}
                          >
                            {deleteId === site.id ? "Deleting…" : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
