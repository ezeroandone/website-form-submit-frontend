import { GOOGLE_LOGIN_URL } from "@/lib/api";

export default function LandingPage() {
  return (
    <>
      <nav className="nav">
        <span className="nav-brand">FormSend</span>
        <div className="nav-links">
          <a href="/pricing">Pricing</a>
          <a href={GOOGLE_LOGIN_URL} className="btn-primary" style={{ padding: "0.4rem 1rem", borderRadius: 8, background: "#C5A059", color: "#000", fontWeight: 700 }}>
            Sign in with Google
          </a>
        </div>
      </nav>

      <main style={{ maxWidth: 720, margin: "0 auto", padding: "5rem 1.5rem", textAlign: "center" }}>
        <span className="badge badge-gold" style={{ marginBottom: "1.5rem" }}>Free to start</span>
        <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.25rem)", fontWeight: 800, lineHeight: 1.15, marginBottom: "1.25rem" }}>
          A contact form backend<br />that just works
        </h1>
        <p style={{ fontSize: "1.15rem", color: "var(--muted)", maxWidth: 520, margin: "0 auto 2.5rem" }}>
          Register your website, get an API key, drop in the embed snippet.
          FormSend handles email delivery — no server required.
        </p>

        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap", marginBottom: "4rem" }}>
          <a href={GOOGLE_LOGIN_URL}
            style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "#C5A059", color: "#000", fontWeight: 700, padding: "0.75rem 1.75rem", borderRadius: 8, fontSize: "1rem" }}>
            Get started — it&apos;s free
          </a>
          <a href="/pricing"
            style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "var(--surface)", color: "var(--text)", border: "1px solid var(--border)", fontWeight: 600, padding: "0.75rem 1.75rem", borderRadius: 8, fontSize: "1rem" }}>
            See pricing
          </a>
        </div>

        {/* How it works */}
        <section style={{ textAlign: "left", marginBottom: "4rem" }}>
          <h2 style={{ fontSize: "1.35rem", fontWeight: 700, marginBottom: "1.5rem", textAlign: "center" }}>How it works</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
            {[
              ["1", "Sign in", "Use your Google account — no password to manage."],
              ["2", "Register a website", "Add your domain and get a unique API key."],
              ["3", "Embed the snippet", "Copy the pre-built HTML form into your page."],
              ["4", "Receive emails", "Submissions arrive in your inbox instantly."],
            ].map(([num, title, desc]) => (
              <div key={num} className="card" style={{ textAlign: "left" }}>
                <div style={{ color: "var(--gold)", fontWeight: 800, fontSize: "1.5rem", marginBottom: "0.5rem" }}>{num}</div>
                <div style={{ fontWeight: 700, marginBottom: "0.25rem" }}>{title}</div>
                <div style={{ color: "var(--muted)", fontSize: "0.9rem" }}>{desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing preview */}
        <section id="pricing" style={{ textAlign: "center", marginBottom: "4rem" }}>
          <h2 style={{ fontSize: "1.35rem", fontWeight: 700, marginBottom: "0.5rem" }}>Simple pricing</h2>
          <p style={{ color: "var(--muted)", marginBottom: "2rem" }}>Start free. Pay once for more websites.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem" }}>
            {[
              { name: "Free", price: "$0", desc: "1 website", note: "Forever free" },
              { name: "Starter", price: "$1", desc: "5 websites", note: "One-time payment" },
              { name: "Pro", price: "$5", desc: "50 websites", note: "One-time payment" },
            ].map((plan) => (
              <div key={plan.name} className="card" style={{ textAlign: "center" }}>
                <div style={{ fontWeight: 700, marginBottom: "0.5rem" }}>{plan.name}</div>
                <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--gold)" }}>{plan.price}</div>
                <div style={{ color: "var(--muted)", fontSize: "0.9rem", margin: "0.4rem 0" }}>{plan.desc}</div>
                <div style={{ fontSize: "0.75rem", color: "var(--muted)" }}>{plan.note}</div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer style={{ borderTop: "1px solid var(--border)", padding: "1.5rem", textAlign: "center", color: "var(--muted)", fontSize: "0.85rem" }}>
        © {new Date().getFullYear()} FormSend · <a href="mailto:ezeroandone@gmail.com">Contact</a>
      </footer>
    </>
  );
}
