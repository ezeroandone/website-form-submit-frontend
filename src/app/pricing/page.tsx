"use client";

import { useState } from "react";
import { initiatePayment, GOOGLE_LOGIN_URL } from "@/lib/api";

const API = process.env.NEXT_PUBLIC_API_URL ?? "https://api.formsend.ezeroandone.io";

const plans = [
  {
    name: "Free",
    price: 0,
    period: "Forever",
    tagline: "Everything you need for one site",
    sites: "1 website",
    features: [
      "1 registered domain",
      "Unlimited form submissions",
      "Email delivery via Resend",
      "Email verification for delivery address",
      "API key management",
      "Full embed snippet & docs",
    ],
    cta: "Start for free",
    highlight: false,
  },
  {
    name: "Starter",
    price: 1,
    period: "One-time · no subscription",
    tagline: "For freelancers managing client sites",
    sites: "5 websites",
    features: [
      "5 registered domains",
      "Unlimited form submissions",
      "Email delivery via Resend",
      "Email verification for delivery address",
      "API key management",
      "Full embed snippet & docs",
    ],
    cta: "Buy for $1",
    highlight: true,
    badge: "Most popular",
  },
  {
    name: "Pro",
    price: 5,
    period: "One-time · no subscription",
    tagline: "For agencies building at scale",
    sites: "50 websites",
    features: [
      "50 registered domains",
      "Unlimited form submissions",
      "Email delivery via Resend",
      "Email verification for delivery address",
      "API key management",
      "Full embed snippet & docs",
    ],
    cta: "Buy for $5",
    highlight: false,
  },
];

const faqs = [
  {
    q: "Is this really a one-time payment?",
    a: "Yes. You pay once and the extra website slots are yours permanently. There are no monthly fees, no renewals, and no subscription to cancel.",
  },
  {
    q: "What happens if I need more than 50 websites?",
    a: "Buy multiple Pro slots — they stack. $10 gives you 100 websites, $15 gives you 150, and so on.",
  },
  {
    q: "Does the free plan have any usage limits?",
    a: "No usage caps. The free plan supports one registered domain with unlimited form submissions. The only limit is the number of websites you can register.",
  },
  {
    q: "What payment methods are supported?",
    a: "Payments are processed by Paystack and support card payments, bank transfers, and other local methods depending on your region.",
  },
  {
    q: "Can I try before buying?",
    a: "Absolutely. Sign up for free, register one website, and verify your email. You get the full product experience — just limited to one site.",
  },
];

export default function PricingPage() {
  const [loading, setLoading] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  async function handleBuy(amount: 1 | 5) {
    setError("");
    setLoading(amount);
    try {
      const { authorization_url } = await initiatePayment(amount);
      window.location.href = authorization_url;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Payment failed";
      if (msg.toLowerCase().includes("unauthorized")) {
        window.location.href = `${API}/auth/google`;
      } else {
        setError(msg);
        setLoading(null);
      }
    }
  }

  return (
    <>
      <nav className="nav">
        <a href="/" className="nav-brand">
          <span className="material-icons-round" style={{ fontSize: "1.1rem", verticalAlign: "middle", marginRight: "0.3rem" }}>send</span>
          FormSend
        </a>
        <div className="nav-links">
          <a href="/" className="nav-link">Home</a>
          <a href="/docs" className="nav-link">Docs</a>
          <a href="/dashboard" className="nav-link">Dashboard</a>
        </div>
      </nav>

      <main style={{ maxWidth: 960, margin: "0 auto", padding: "4rem 1.5rem" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <span className="section-label">Pricing</span>
          <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.75rem)", fontWeight: 800, letterSpacing: "-0.03em", margin: "0.75rem 0 1rem", lineHeight: 1.15 }}>
            Pay once. Keep forever.
          </h1>
          <p style={{ color: "var(--muted)", fontSize: "1.05rem", maxWidth: 500, margin: "0 auto" }}>
            No monthly bills. No surprises. Buy more website slots once — they belong to you.
          </p>
        </div>

        {error && (
          <div className="error-msg" style={{ justifyContent: "center", marginBottom: "1.5rem" }}>
            <span className="material-icons-round" style={{ fontSize: "1rem" }}>error_outline</span>
            {error}
          </div>
        )}

        {/* Plans */}
        <div className="pricing-grid" style={{ marginBottom: "4rem" }}>
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`card ${plan.highlight ? "card-highlight" : ""}`}
              style={{ position: "relative", display: "flex", flexDirection: "column" }}
            >
              {plan.badge && (
                <div style={{ position: "absolute", top: "-0.65rem", left: "1.5rem" }}>
                  <span className="badge badge-gold">
                    <span className="material-icons-round" style={{ fontSize: "0.75rem" }}>star</span>
                    {plan.badge}
                  </span>
                </div>
              )}

              <div style={{ marginBottom: "1.5rem" }}>
                <div style={{ fontWeight: 700, fontSize: "1rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.75rem" }}>
                  {plan.name}
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: "0.25rem", marginBottom: "0.25rem" }}>
                  <span className="plan-price">{plan.price === 0 ? "Free" : `$${plan.price}`}</span>
                </div>
                <div className="plan-period">{plan.period}</div>
                <div style={{ fontWeight: 600, color: "var(--gold)", marginBottom: "0.5rem" }}>{plan.sites}</div>
                <p style={{ fontSize: "0.875rem", color: "var(--muted)", lineHeight: 1.5 }}>{plan.tagline}</p>
              </div>

              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.6rem", marginBottom: "1.75rem", flex: 1 }}>
                {plan.features.map((f) => (
                  <li key={f} className="plan-feature">
                    <span className="material-icons-round plan-feature-check">check_circle</span>
                    {f}
                  </li>
                ))}
              </ul>

              {plan.price === 0 ? (
                <a
                  href={`${API}/auth/google`}
                  className="btn-ghost btn-lg"
                  style={{ textAlign: "center", display: "block" }}
                >
                  {plan.cta}
                </a>
              ) : (
                <button
                  className="btn-primary btn-lg"
                  style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem" }}
                  disabled={loading === plan.price}
                  onClick={() => handleBuy(plan.price as 1 | 5)}
                >
                  {loading === plan.price ? (
                    <>
                      <span className="material-icons-round" style={{ fontSize: "1rem", animation: "spin 1s linear infinite" }}>refresh</span>
                      Redirecting…
                    </>
                  ) : (
                    <>
                      <span className="material-icons-round" style={{ fontSize: "1rem" }}>shopping_cart</span>
                      {plan.cta}
                    </>
                  )}
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Trust bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1.75rem", flexWrap: "wrap", marginBottom: "4rem", padding: "1.25rem", background: "var(--surface)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-lg)" }}>
          {[
            { icon: "lock", text: "Secure checkout via Paystack" },
            { icon: "bolt", text: "Slots added instantly" },
            { icon: "all_inclusive", text: "No expiry, no renewal" },
            { icon: "support_agent", text: "Email support included" },
          ].map(({ icon, text }) => (
            <div key={text} style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.85rem", color: "var(--muted)" }}>
              <span className="material-icons-round" style={{ fontSize: "1rem", color: "var(--gold)" }}>{icon}</span>
              {text}
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <h2 style={{ fontSize: "1.4rem", fontWeight: 700, textAlign: "center", marginBottom: "2rem", letterSpacing: "-0.02em" }}>
            Frequently asked questions
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="card"
                style={{ padding: "1rem 1.25rem", cursor: "pointer", userSelect: "none" }}
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
                  <span style={{ fontWeight: 600, fontSize: "0.95rem" }}>{faq.q}</span>
                  <span className="material-icons-round" style={{ fontSize: "1.1rem", color: "var(--muted)", transition: "transform 0.2s", transform: openFaq === i ? "rotate(180deg)" : "none", flexShrink: 0 }}>
                    expand_more
                  </span>
                </div>
                {openFaq === i && (
                  <p style={{ marginTop: "0.75rem", color: "var(--muted)", fontSize: "0.9rem", lineHeight: 1.65 }}>{faq.a}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="footer">
        <div className="footer-inner">
          <span className="nav-brand" style={{ fontSize: "1rem" }}>
            <span className="material-icons-round" style={{ fontSize: "1rem", verticalAlign: "middle", marginRight: "0.25rem" }}>send</span>
            FormSend
          </span>
          <div className="footer-links">
            <a href="/" className="footer-link">Home</a>
            <a href="/docs" className="footer-link">Docs</a>
            <a href="/dashboard" className="footer-link">Dashboard</a>
            <a href="mailto:ezeroandone@gmail.com" className="footer-link">Contact</a>
          </div>
          <span className="footer-copy">© {new Date().getFullYear()} FormSend</span>
        </div>
      </footer>
    </>
  );
}
