"use client";

import { useEffect, useRef } from "react";
import { GOOGLE_LOGIN_URL } from "@/lib/api";

const API = process.env.NEXT_PUBLIC_API_URL ?? "https://api.formsend.ezeroandone.io";

const steps = [
  { icon: "login", title: "Sign in with Google", desc: "One click. No passwords, no account setup. Your Google account is all you need." },
  { icon: "language", title: "Register your website", desc: "Add your domain and the email where you want to receive form submissions." },
  { icon: "code", title: "Paste one snippet", desc: "Copy the generated HTML form — 8 lines. Drop it anywhere on your website." },
  { icon: "mark_email_read", title: "Receive submissions", desc: "Every form submission lands directly in your inbox, beautifully formatted." },
];

const features = [
  { icon: "verified_user", title: "Email verification", desc: "Every delivery address is verified before going live. No misdirected messages." },
  { icon: "bolt", title: "Instant delivery", desc: "Powered by Resend — globally distributed, sub-second email delivery." },
  { icon: "vpn_key", title: "Per-site API keys", desc: "Each website gets its own key. Rotate or revoke without affecting other sites." },
  { icon: "block", title: "Abuse protection", desc: "Built-in rate limiting blocks spam at the infrastructure level — before it hits your inbox." },
  { icon: "public", title: "Works on any stack", desc: "Plain HTML, React, Vue, Webflow, Framer — if it can POST a form, it works." },
  { icon: "payments", title: "Pay once, own it", desc: "No monthly fees. Buy more website slots once and they are yours forever." },
];

export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  // Subtle parallax on scroll
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (glowRef.current) {
        glowRef.current.style.transform = `translateX(-50%) translateY(${y * 0.3}px)`;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Intersection observer for fade-in animations
  useEffect(() => {
    const els = document.querySelectorAll(".animate-in");
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.1 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* ── Structured data ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "FormSend",
          "url": "https://formsend.ezeroandone.io",
          "applicationCategory": "DeveloperApplication",
          "operatingSystem": "Any",
          "description": "Add a working contact form to any website in 60 seconds. No server, no hosting, no code required.",
          "offers": [
            { "@type": "Offer", "price": "0", "priceCurrency": "USD", "name": "Free" },
            { "@type": "Offer", "price": "1", "priceCurrency": "USD", "name": "Starter" },
            { "@type": "Offer", "price": "5", "priceCurrency": "USD", "name": "Pro" },
          ],
        }) }}
      />

      {/* ── Nav ── */}
      <nav className="nav">
        <a href="/" className="nav-brand">
          <span className="material-icons-round" style={{ fontSize: "1.1rem", verticalAlign: "middle", marginRight: "0.3rem" }}>send</span>
          FormSend
        </a>
        <div className="nav-links">
          <a href="#features" className="nav-link">Features</a>
          <a href="#pricing" className="nav-link">Pricing</a>
          <a href="/docs" className="nav-link">Docs</a>
          <a href={`${API}/auth/google`} className="btn-primary btn-sm" style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
            <span className="material-icons-round" style={{ fontSize: "0.95rem" }}>login</span>
            Sign in
          </a>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section ref={heroRef} className="hero-section">
        <div ref={glowRef} className="hero-glow" />
        <div className="hero-glow-2" />

        <div className="hero-inner animate-in">
          <div className="hero-badge">
            <span className="material-icons-round" style={{ fontSize: "0.9rem" }}>flash_on</span>
            Free to start — no credit card
          </div>

          <h1 className="hero-title">
            Your contact form,<br />
            <span className="hero-title-accent">delivered in 60 seconds</span>
          </h1>

          <p className="hero-subtitle">
            Stop wrestling with backend code, SMTP servers, and email libraries.
            FormSend gives every website a working contact form with one HTML snippet.
          </p>

          <div className="hero-cta">
            <a href={`${API}/auth/google`} className="btn-primary btn-lg hero-cta-primary">
              <span className="material-icons-round" style={{ fontSize: "1.1rem" }}>rocket_launch</span>
              Get started free
            </a>
            <a href="#how-it-works" className="btn-ghost btn-lg">
              See how it works
              <span className="material-icons-round" style={{ fontSize: "1rem" }}>arrow_downward</span>
            </a>
          </div>

          <p className="hero-footnote">
            <span className="material-icons-round" style={{ fontSize: "0.85rem", verticalAlign: "middle" }}>lock</span>
            Sign in with Google · No password required
          </p>
        </div>

        {/* Code preview */}
        <div className="hero-code animate-in" style={{ animationDelay: "0.15s" }}>
          <div className="code-demo">
            <div className="code-demo-header">
              <div className="code-demo-dot" style={{ background: "#ff5f57" }} />
              <div className="code-demo-dot" style={{ background: "#febc2e" }} />
              <div className="code-demo-dot" style={{ background: "#28c840" }} />
              <span style={{ marginLeft: "0.5rem", fontSize: "0.72rem", color: "var(--muted)", fontFamily: "monospace" }}>contact.html</span>
            </div>
            <pre>{`<form action="https://api.formsend.ezeroandone.io/submit"
      method="POST">
  <input type="hidden"
         name="api_key"
         value="fs_••••••••" />
  <input type="text"   name="name"    required />
  <input type="email"  name="email"   required />
  <textarea            name="message" required></textarea>
  <button type="submit">Send message</button>
</form>`}</pre>
          </div>
          <div className="hero-code-label">
            <span className="material-icons-round" style={{ fontSize: "0.9rem", color: "var(--success)" }}>check_circle</span>
            That's the entire integration
          </div>
        </div>
      </section>

      {/* ── Social proof bar ── */}
      <section className="proof-section animate-in">
        <div className="proof-bar">
          {[
            { stat: "< 60s", label: "Average setup time" },
            { stat: "0", label: "Lines of backend code" },
            { stat: "100%", label: "Deliverability via Resend" },
            { stat: "$0", label: "To start" },
          ].map(({ stat, label }) => (
            <div key={label} className="proof-stat">
              <strong>{stat}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how-it-works" className="section animate-in">
        <div className="section-header">
          <span className="section-label">How it works</span>
          <h2 className="section-title">From zero to live in four steps</h2>
          <p className="section-sub">No DevOps. No AWS. No configuration rabbit holes.</p>
        </div>

        <div className="steps-grid">
          {steps.map((step, i) => (
            <div key={step.icon} className="step-card animate-in" style={{ animationDelay: `${i * 0.08}s` }}>
              <div className="step-icon-wrap">
                <span className="material-icons-round step-icon-symbol">{step.icon}</span>
              </div>
              <div className="step-number-badge">{i + 1}</div>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-desc">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="section section-alt animate-in">
        <div className="section-header">
          <span className="section-label">Built for reliability</span>
          <h2 className="section-title">Everything you need, nothing you don&apos;t</h2>
          <p className="section-sub">Security, delivery, and abuse protection handled at the infrastructure layer.</p>
        </div>

        <div className="features-grid">
          {features.map((f, i) => (
            <div key={f.icon} className="feature-card animate-in" style={{ animationDelay: `${i * 0.06}s` }}>
              <div className="feature-icon-wrap">
                <span className="material-icons-round feature-icon-symbol">{f.icon}</span>
              </div>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="section animate-in">
        <div className="section-header">
          <span className="section-label">Pricing</span>
          <h2 className="section-title">Pay once. Use forever.</h2>
          <p className="section-sub">No monthly bills. No usage caps. Buy more website slots once — they&apos;re yours to keep.</p>
        </div>

        <div className="pricing-grid">
          {[
            {
              name: "Free",
              price: "$0",
              period: "Forever",
              tagline: "Perfect for a personal site or portfolio",
              features: ["1 website", "Unlimited form submissions", "Email verification included", "API key management", "Full embed snippet"],
              cta: "Start for free",
              href: `${API}/auth/google`,
              highlight: false,
            },
            {
              name: "Starter",
              price: "$1",
              period: "One-time · no subscription",
              tagline: "For freelancers managing a handful of client sites",
              features: ["5 websites", "Unlimited form submissions", "Email verification included", "API key management", "Full embed snippet", "Priority delivery"],
              cta: "Buy for $1",
              href: "/pricing",
              highlight: true,
              badge: "Most popular",
            },
            {
              name: "Pro",
              price: "$5",
              period: "One-time · no subscription",
              tagline: "For agencies building forms across dozens of websites",
              features: ["50 websites", "Unlimited form submissions", "Email verification included", "API key management", "Full embed snippet", "Priority delivery"],
              cta: "Buy for $5",
              href: "/pricing",
              highlight: false,
            },
          ].map((plan, i) => (
            <div
              key={plan.name}
              className={`landing-plan-card animate-in ${plan.highlight ? "landing-plan-highlight" : ""}`}
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              {plan.badge && <div className="plan-badge">{plan.badge}</div>}
              <div className="plan-name">{plan.name}</div>
              <div className="plan-price-row">
                <span className="plan-price">{plan.price}</span>
              </div>
              <div className="plan-period">{plan.period}</div>
              <p className="plan-tagline">{plan.tagline}</p>
              <ul className="plan-features-list">
                {plan.features.map((f) => (
                  <li key={f} className="plan-feature">
                    <span className="material-icons-round plan-feature-check">check_circle</span>
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href={plan.href}
                className={plan.highlight ? "btn-primary btn-lg plan-cta" : "btn-ghost btn-lg plan-cta"}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>

        <p className="pricing-note">
          <span className="material-icons-round" style={{ fontSize: "0.9rem", verticalAlign: "middle", marginRight: "0.3rem" }}>security</span>
          Payments processed securely by Paystack. Slots added to your account instantly after payment.
        </p>
      </section>

      {/* ── Final CTA ── */}
      <section className="cta-section animate-in">
        <div className="cta-glow" />
        <div className="cta-inner">
          <h2 className="cta-title">Ready to stop wrestling with forms?</h2>
          <p className="cta-sub">Sign in with Google and have your first form live in under a minute.</p>
          <a href={`${API}/auth/google`} className="btn-primary btn-lg">
            <span className="material-icons-round" style={{ fontSize: "1.1rem" }}>rocket_launch</span>
            Get started — it&apos;s free
          </a>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="footer">
        <div className="footer-inner">
          <span className="nav-brand" style={{ fontSize: "1rem" }}>
            <span className="material-icons-round" style={{ fontSize: "1rem", verticalAlign: "middle", marginRight: "0.25rem" }}>send</span>
            FormSend
          </span>
          <div className="footer-links">
            <a href="#features" className="footer-link">Features</a>
            <a href="#pricing" className="footer-link">Pricing</a>
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
