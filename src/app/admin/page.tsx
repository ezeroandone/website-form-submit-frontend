"use client";

import { useEffect, useState } from "react";
import { getMe, adminListUsers, adminUpdateUser, UserProfile } from "@/lib/api";
import { Nav } from "@/components/Nav";

export default function AdminPage() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);

  // Editable slot counts (keyed by user id)
  const [slotEdits, setSlotEdits] = useState<Record<string, string>>({});

  useEffect(() => {
    async function load() {
      try {
        const profile = await getMe();
        if (!profile) { window.location.href = "/"; return; }
        if (!profile.is_admin) { window.location.href = "/dashboard"; return; }
        setCurrentUser(profile);
        const all = await adminListUsers();
        setUsers(all);
        setSlotEdits(Object.fromEntries(all.map((u) => [u.id, String(u.slot_count)])));
      } catch {
        setError("Failed to load admin data.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleToggleAdmin(user: UserProfile) {
    setSavingId(user.id);
    setError("");
    try {
      await adminUpdateUser(user.id, { is_admin: !user.is_admin });
      setUsers((prev) => prev.map((u) => u.id === user.id ? { ...u, is_admin: !u.is_admin } : u));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setSavingId(null);
    }
  }

  async function handleSaveSlots(user: UserProfile) {
    const val = parseInt(slotEdits[user.id] ?? "", 10);
    if (!val || val < 1) { setError("slot_count must be ≥ 1"); return; }
    setSavingId(user.id);
    setError("");
    try {
      await adminUpdateUser(user.id, { slot_count: val });
      setUsers((prev) => prev.map((u) => u.id === user.id ? { ...u, slot_count: val } : u));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setSavingId(null);
    }
  }

  if (loading) {
    return <div style={{ padding: "4rem", textAlign: "center", color: "var(--muted)" }}>Loading…</div>;
  }

  return (
    <>
      <Nav user={currentUser} />
      <main className="container">
        <h1 className="page-title">Admin — Users</h1>
        <p className="page-sub">Manage all platform users.</p>

        {error && <p className="error-msg" style={{ marginBottom: "1rem" }}>{error}</p>}

        <div className="card" style={{ overflowX: "auto" }}>
          <table>
            <thead>
              <tr>
                <th>Email</th>
                <th>Name</th>
                <th>Slots</th>
                <th>Admin</th>
                <th>Joined</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td style={{ fontSize: "0.875rem" }}>{u.email}</td>
                  <td style={{ fontSize: "0.875rem" }}>{u.name}</td>
                  <td>
                    <div style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
                      <input
                        type="number"
                        min={1}
                        value={slotEdits[u.id] ?? u.slot_count}
                        onChange={(e) => setSlotEdits((p) => ({ ...p, [u.id]: e.target.value }))}
                        style={{ width: 70 }}
                      />
                      <button
                        className="btn-ghost btn-sm"
                        disabled={savingId === u.id}
                        onClick={() => handleSaveSlots(u)}
                      >
                        {savingId === u.id ? "…" : "Save"}
                      </button>
                    </div>
                  </td>
                  <td>
                    <label style={{ display: "flex", alignItems: "center", gap: "0.4rem", cursor: "pointer" }}>
                      <input
                        type="checkbox"
                        checked={u.is_admin}
                        disabled={savingId === u.id}
                        onChange={() => handleToggleAdmin(u)}
                        style={{ width: "auto", accentColor: "var(--gold)" }}
                      />
                      {u.is_admin ? <span className="badge badge-gold">Admin</span> : null}
                    </label>
                  </td>
                  <td style={{ fontSize: "0.8rem", color: "var(--muted)" }}>
                    {new Date(u.created_at).toLocaleDateString()}
                  </td>
                  <td style={{ fontSize: "0.75rem", color: "var(--muted)" }}>
                    <code style={{ background: "transparent", border: "none", padding: 0 }}>{u.id.slice(0, 8)}…</code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
}
