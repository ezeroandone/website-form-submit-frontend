"use client";

import { useState } from "react";
import { initiatePayment, GOOGLE_LOGIN_URL } from "@/lib/api";

interface Plan {
  name: string;
  price: number;
  sites: string;
  perks: string[];
  highlight?: boolean;
}

const plans: Plan[] = [
  {
    name: "Free",
    price: 0,
    sites: "1 website",
    perks: ["1 registered domain", "Unlimited form submissions", "Email delivery via Resend", "API key management"],
  },
  {
    name: "Starter",
    price: 1,
    sites: "5 websites",
    perks: ["5 registered domains", "Unlimited form submissions", "Email delivery via Resend", "API key management", "One-time payment — no subscription"],
    highlight: true,
  },
  {
    name: "Pro",
    price: 5,
    sites: "50 websites",
    perks: ["50 registered domains", "Unlimited form submissions", "Email delivery via Resend", "API key management", "One-time payment — no subscription"],
  },
];

export default function PricingPage() {
  const [loading, setLoading] = useState<number | null>(null);
  const [error, setError] = useState("");

  async function handleBuy(amount: 1 | 5) {
    setError("");
    setLoading(amount);
    try {
      const { authorization_url } = await initiatePayment(amount);
      window.location.href = authorization_url;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Payment failed";
      if (msg.toLowerCase().includes("unauthorized")) {
        window.location.href = GOOGLE_LOGIN_URL;
      } else {
        setError(msg);
        setLoading(null);
      }
    }
  }

  return (
    <>
      <nav className="nav">
        <a href="/" className="nav-brand">FormSend</a>
        <div className="nav-links">
          <a href="/dashboard">Dashboard</a>
        </div>
      </nav>

      <main className="container" style={{ textAlign: "center" }}>
        <h1 className="page-title" style={{ marginBottom: "0.5rem" }}>Pricing</h1>
        <p className="page-sub">Pay once, keep forever. No subscriptions.</p>

        {error && <p className="error-msg" style={{ marginBottom: "1rem" }}>{error}</p>}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.25rem", maxWidth: 760, margin: "0 auto" }}>
          {plans.map((plan) => (
            <div
              key={plan.name}
              className="card"
              style={{
                textAlign: "left",
                border: plan.highlight ? "1px solid var(--gold)" : undefined,
                position: "relative",
              }}
            >
              {plan.highlight && (
                <span className="badge badge-gold" style={{ position: "absolute", top: "-0.6rem", left: "1.25rem" }}>
                  Most popular
                </span>
              )}
              <div style={{ fontWeight: 700, fontSize: "1.1rem", marginBottom: "0.5rem" }}>{plan.name}</div>
              <div style={{ fontSize: "2.25rem", fontWeight: 800, color: "var(--gold)", marginBottom: "0.25rem" }}>
                {plan.price === 0 ? "Free" : `$${plan.price}`}
              </div>
              <div style={{ color: "var(--muted)", fontSize: "0.85rem", marginBottom: "1.25rem" }}>
                {plan.price === 0 ? "Forever free" : "One-time payment"}
              </div>
              <div style={{ fontWeight: 600, marginBottom: "1rem" }}>{plan.sites}</div>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.4rem", marginBottom: "1.5rem" }}>
                {plan.perks.map((p) => (
                  <li key={p} style={{ fontSize: "0.875rem", color: "var(--muted)", display: "flex", gap: "0.4rem" }}>
                    <span style={{ color: "var(--success)" }}>✓</span> {p}
                  </li>
                ))}
              </ul>

              {plan.price === 0 ? (
                <a
                  href={GOOGLE_LOGIN_URL}
                  style={{ display: "block", textAlign: "center", background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)", fontWeight: 600, padding: "0.55rem 1rem", borderRadius: 8, fontSize: "0.9rem" }}
                >
                  Get started free
                </a>
              ) : (
                <button
                  className="btn-primary"
                  style={{ width: "100%" }}
                  disabled={loading === plan.price}
                  onClick={() => handleBuy(plan.price as 1 | 5)}
                >
                  {loading === plan.price ? "Redirecting…" : `Buy for $${plan.price}`}
                </button>
              )}
            </div>
          ))}
        </div>

        <p style={{ color: "var(--muted)", fontSize: "0.85rem", marginTop: "2.5rem" }}>
          Payments are processed securely by Paystack.
          Your slot count increases immediately after payment is confirmed.
        </p>
      </main>
    </>
  );
}
