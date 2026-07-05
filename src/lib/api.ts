const API = process.env.NEXT_PUBLIC_API_URL ?? "https://api.formsend.ezeroandone.io";

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  is_admin: boolean;
  slot_count: number;
  website_count: number;
  created_at: string;
}

export interface WebsiteRecord {
  id: string;
  domain: string;
  created_at: string;
}

export interface CreateWebsiteResult {
  website_id: string;
  domain: string;
  created_at: string;
  api_key: string; // shown once
}

/** Fetch with credentials so session cookie is sent */
function apiFetch(path: string, init?: RequestInit) {
  return fetch(`${API}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
}

export async function getMe(): Promise<UserProfile | null> {
  const res = await apiFetch("/api/me");
  if (res.status === 401) return null;
  if (!res.ok) throw new Error("Failed to fetch profile");
  return res.json();
}

export async function listWebsites(): Promise<WebsiteRecord[]> {
  const res = await apiFetch("/api/websites");
  if (!res.ok) throw new Error("Failed to fetch websites");
  return res.json();
}

export async function createWebsite(domain: string): Promise<CreateWebsiteResult> {
  const res = await apiFetch("/api/websites", {
    method: "POST",
    body: JSON.stringify({ domain }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Failed to create website");
  return data;
}

export async function deleteWebsite(id: string): Promise<void> {
  const res = await apiFetch(`/api/websites/${id}`, { method: "DELETE" });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error ?? "Failed to delete website");
  }
}

export async function rotateKey(websiteId: string): Promise<{ api_key: string }> {
  const res = await apiFetch("/api/keys/rotate", {
    method: "POST",
    body: JSON.stringify({ website_id: websiteId }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Failed to rotate key");
  return data;
}

export async function initiatePayment(amount: 1 | 5): Promise<{ authorization_url: string }> {
  const res = await apiFetch("/api/payment/initiate", {
    method: "POST",
    body: JSON.stringify({ amount }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Failed to initiate payment");
  return data;
}

export async function adminListUsers(): Promise<UserProfile[]> {
  const res = await apiFetch("/api/admin/users");
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
}

export async function adminUpdateUser(
  id: string,
  updates: { is_admin?: boolean; slot_count?: number }
): Promise<void> {
  const res = await apiFetch(`/api/admin/users/${id}`, {
    method: "PATCH",
    body: JSON.stringify(updates),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error ?? "Failed to update user");
  }
}

export const GOOGLE_LOGIN_URL = `${API}/auth/google`;
