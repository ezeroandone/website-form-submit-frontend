"use client";

import { useEffect, useState } from "react";
import { Nav } from "@/components/Nav";

const API_URL = "https://api.formsend.ezeroandone.io";

const htmlExample = `<form
  action="${API_URL}/submit"
  method="POST"
>
  <input type="hidden" name="api_key" value="YOUR_API_KEY" />
  <input type="text"   name="name"    placeholder="Your name"    required />
  <input type="email"  name="email"   placeholder="your@email.com" required />
  <input type="text"   name="subject" placeholder="Subject" />
  <textarea            name="message" placeholder="Your message" required></textarea>
  <button type="submit">Send</button>
</form>`;

const fetchExample = `const res = await fetch("${API_URL}/submit", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    api_key: "YOUR_API_KEY",
    name: "Jane Smith",
    email: "jane@example.com",
    subject: "Hello",
    message: "This is a test submission.",
  }),
});

const data = await res.json();
// { success: true, message: "Message sent successfully." }`;

const jqueryExample = `$("#contactForm").on("submit", function (e) {
  e.preventDefault();
  $.ajax({
    url: "${API_URL}/submit",
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify({
      api_key: "YOUR_API_KEY",
      name:    $("#name").val(),
      email:   $("#email").val(),
      subject: $("#subject").val(),
      message: $("#message").val(),
    }),
    success: function (data) { console.log("Sent!", data); },
    error:   function (xhr)  { console.error(xhr.responseJSON); },
  });
});`;

const curlExample = `curl -X POST ${API_URL}/submit \\
  -H "Content-Type: application/json" \\
  -d '{
    "api_key": "YOUR_API_KEY",
    "name":    "Jane Smith",
    "email":   "jane@example.com",
    "subject": "Hello",
    "message": "This is a test."
  }'`;


const fields = [
  { name: "api_key", type: "string", required: true,  desc: "Your website API key from the dashboard. Identifies which site this submission belongs to." },
  { name: "name",    type: "string", required: true,  desc: "Sender's full name. Max 255 characters." },
  { name: "email",   type: "string", required: true,  desc: "Sender's email address. Must be a valid email format. Used as the reply-to address." },
  { name: "message", type: "string", required: true,  desc: "Body of the message. Max 5 000 characters." },
  { name: "subject", type: "string", required: false, desc: "Email subject line. Max 255 characters. Defaults to \"New form submission from {name}\" if omitted." },
  { name: "…extras", type: "string", required: false, desc: "Any additional fields (e.g. phone, company, service) are forwarded in the email as extra rows." },
];

const errors = [
  { status: "400", code: "Missing required fields",      desc: "name, email, or message is absent from the request body." },
  { status: "400", code: "Invalid sender email format",  desc: "The email field is not a valid email address." },
  { status: "400", code: "Name / message too long",      desc: "name exceeds 255 chars or message exceeds 5 000 chars." },
  { status: "401", code: "Missing API key",              desc: "The api_key field was not included in the request." },
  { status: "401", code: "Invalid API key",              desc: "The api_key does not match any registered website. Check you copied it correctly from the dashboard." },
  { status: "403", code: "Origin not allowed",           desc: "The HTTP Origin header hostname does not match the domain registered in the dashboard. Register the exact hostname your site is served from." },
  { status: "403", code: "Email not verified",           desc: "The notification email for this website has not been verified yet. Check your inbox or use Resend email in the dashboard." },
  { status: "429", code: "Too many requests",            desc: "More than the allowed number of submissions were sent from the same IP within 10 minutes. Slow down and retry later." },
  { status: "500", code: "Failed to send email",         desc: "A transient error on the mail-delivery side. Retry the request." },
];


function CodeBlock({ label, code }: { label: string; code: string }) {
  return (
    <div className="code-demo" style={{ marginBottom: "1.5rem" }}>
      <div className="code-demo-header">
        <div className="code-demo-dot" style={{ background: "#ff5f57" }} />
        <div className="code-demo-dot" style={{ background: "#febc2e" }} />
        <div className="code-demo-dot" style={{ background: "#28c840" }} />
        <span style={{ marginLeft: "0.5rem", fontSize: "0.72rem", color: "var(--muted)", fontFamily: "monospace" }}>{label}</span>
      </div>
      <pre>{code}</pre>
    </div>
  );
}

function SectionAnchor({ id, label, title }: { id: string; label: string; title: string }) {
  return (
    <div style={{ marginBottom: "0.5rem" }}>
      <span className="section-label">{label}</span>
      <h2 id={id} className="section-title" style={{ marginBottom: "1rem", textAlign: "left", fontSize: "1.4rem" }}>{title}</h2>
    </div>
  );
}


const TOC = [
  { href: "#overview",   label: "Overview"       },
  { href: "#quickstart", label: "Quick start"    },
  { href: "#endpoint",   label: "Endpoint"       },
  { href: "#fields",     label: "Request fields" },
  { href: "#responses",  label: "Responses"      },
  { href: "#errors",     label: "Error reference"},
  { href: "#examples",   label: "Code examples"  },
  { href: "#domain",     label: "Domain setup"   },
  { href: "#faq",        label: "FAQ"            },
];

export default function DocsPage() {
  const [activeId, setActiveId] = useState("overview");

  useEffect(() => {
    const sectionIds = TOC.map(({ href }) => href.slice(1));

    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the topmost entry that is intersecting
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: "-80px 0px -60% 0px", // offset for sticky nav + favour top of viewport
        threshold: 0,
      }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);
  return (
    <>
      <Nav user={null} />
      <div style={{ display: "flex", maxWidth: 1100, margin: "0 auto", padding: "2rem 1.5rem", gap: "3rem", alignItems: "flex-start" }}>

        {/* ── Sidebar TOC ── */}
        <aside style={{ width: 200, minWidth: 180, position: "sticky", top: 80, display: "flex", flexDirection: "column", gap: "0.25rem" }} aria-label="Table of contents">
          <p style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.09em", color: "var(--muted)", marginBottom: "0.5rem" }}>
            On this page
          </p>
          {TOC.map(({ href, label }) => {
            const isActive = activeId === href.slice(1);
            return (
              <a
                key={href}
                href={href}
                style={{
                  fontSize: "0.83rem",
                  color: isActive ? "var(--gold)" : "var(--muted)",
                  padding: "0.3rem 0.6rem",
                  borderRadius: 6,
                  textDecoration: "none",
                  transition: "color 0.15s, background 0.15s",
                  background: isActive ? "var(--gold-light)" : "transparent",
                  borderLeft: isActive ? "2px solid var(--gold)" : "2px solid transparent",
                  fontWeight: isActive ? 600 : 400,
                }}
              >
                {label}
              </a>
            );
          })}
        </aside>

        {/* ── Main content ── */}
        <main style={{ flex: 1, minWidth: 0 }}>
          {/* Hero */}
          <div style={{ marginBottom: "3rem" }}>
            <div className="hero-badge" style={{ marginBottom: "1rem" }}>
              <span className="material-icons-round" style={{ fontSize: "0.9rem" }}>menu_book</span>
              Documentation
            </div>
            <h1 className="page-title" style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>FormSend API Docs</h1>
            <p style={{ color: "var(--text-2)", fontSize: "1rem", lineHeight: 1.7, maxWidth: 580 }}>
              Everything you need to integrate a working contact form into any website in under a minute.
              No backend required — just an HTML snippet and your API key.
            </p>
          </div>

          <div className="divider" />

          {/* Overview */}
          <section id="overview" style={{ marginBottom: "3rem" }}>
            <SectionAnchor id="overview" label="Overview" title="How FormSend works" />
            <p style={{ color: "var(--text-2)", lineHeight: 1.75, marginBottom: "1rem" }}>
              FormSend is a hosted form-submission API. You register your website domain in the dashboard,
              get an API key, and embed a short HTML form. When a visitor submits the form, FormSend
              validates the request, checks your domain and key, and delivers the message to your
              registered notification email via <a href="https://resend.com" target="_blank" rel="noopener noreferrer">Resend</a>.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
              {[
                { icon: "vpn_key",         title: "API-key auth",     desc: "Each website has its own key. No shared secrets." },
                { icon: "verified_user",   title: "Origin verified",  desc: "Submissions only accepted from your registered domain." },
                { icon: "mark_email_read", title: "Email delivery",   desc: "Messages land in your inbox via Resend infrastructure." },
                { icon: "block",           title: "Rate limited",     desc: "Built-in per-IP throttling blocks form spam." },
              ].map(f => (
                <div key={f.icon} className="card" style={{ padding: "1.25rem" }}>
                  <span className="material-icons-round" style={{ color: "var(--gold)", fontSize: "1.4rem", marginBottom: "0.5rem", display: "block" }}>{f.icon}</span>
                  <div style={{ fontWeight: 700, fontSize: "0.9rem", marginBottom: "0.3rem" }}>{f.title}</div>
                  <div style={{ fontSize: "0.82rem", color: "var(--muted)", lineHeight: 1.55 }}>{f.desc}</div>
                </div>
              ))}
            </div>
          </section>

          <div className="divider" />

          {/* Quick start */}
          <section id="quickstart" style={{ marginBottom: "3rem" }}>
            <SectionAnchor id="quickstart" label="Quick start" title="Live in 3 steps" />
            {[
              { n: 1, icon: "login",    title: "Sign in & register your website", body: <>Go to your <a href="/dashboard">dashboard</a>, log in with Google, click <strong>Add a website</strong>, enter your domain (e.g. <code>mysite.com</code>) and the email address where you want to receive submissions. A verification email will be sent — click the link inside it.</> },
              { n: 2, icon: "vpn_key",  title: "Copy your API key", body: <>After adding your website, the dashboard shows your API key once. Copy it immediately — it is only shown at creation (or after a key rotation).</> },
              { n: 3, icon: "code",     title: "Paste the form snippet", body: <>Add the HTML below to your page. Replace <code>YOUR_API_KEY</code> with your key and you are done.</> },
            ].map(step => (
              <div key={step.n} style={{ display: "flex", gap: "1.25rem", marginBottom: "2rem", alignItems: "flex-start" }}>
                <div style={{ width: 36, height: 36, minWidth: 36, borderRadius: "50%", background: "var(--gold-light)", border: "1px solid var(--gold-border)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: "var(--gold)", fontSize: "0.85rem" }}>{step.n}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: "0.95rem", marginBottom: "0.4rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <span className="material-icons-round" style={{ fontSize: "1rem", color: "var(--gold)" }}>{step.icon}</span>
                    {step.title}
                  </div>
                  <p style={{ color: "var(--text-2)", fontSize: "0.875rem", lineHeight: 1.7, marginBottom: step.n === 3 ? "1rem" : 0 }}>{step.body}</p>
                  {step.n === 3 && <CodeBlock label="contact.html" code={htmlExample} />}
                </div>
              </div>
            ))}
          </section>

          <div className="divider" />

          {/* Endpoint */}
          <section id="endpoint" style={{ marginBottom: "3rem" }}>
            <SectionAnchor id="endpoint" label="Endpoint" title="Submit endpoint" />
            <div className="card" style={{ display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap", marginBottom: "1rem" }}>
              <span className="badge badge-gold" style={{ fontSize: "0.75rem", letterSpacing: "0.06em" }}>POST</span>
              <code style={{ fontSize: "0.875rem", background: "transparent", border: "none", padding: 0 }}>{API_URL}/submit</code>
            </div>
            <p style={{ color: "var(--text-2)", fontSize: "0.875rem", lineHeight: 1.7, marginBottom: "0.75rem" }}>
              Accepts <strong>JSON</strong> (<code>Content-Type: application/json</code>) or a standard HTML
              form POST (<code>application/x-www-form-urlencoded</code> / <code>multipart/form-data</code>).
              CORS is open — any origin can POST, but the <code>Origin</code> header must match your registered domain.
            </p>
            <div className="card" style={{ background: "rgba(197,160,89,0.04)", borderColor: "var(--gold-border)", padding: "1rem 1.25rem" }}>
              <p style={{ fontSize: "0.82rem", color: "var(--text-2)", margin: 0, lineHeight: 1.7 }}>
                <span className="material-icons-round" style={{ fontSize: "0.9rem", verticalAlign: "middle", color: "var(--gold)", marginRight: "0.35rem" }}>info</span>
                Browser-submitted forms automatically send the <code>Origin</code> header. When testing with
                cURL or Postman there is no <code>Origin</code>, so the origin check is skipped — that is expected.
              </p>
            </div>
          </section>

          <div className="divider" />

          {/* Fields */}
          <section id="fields" style={{ marginBottom: "3rem" }}>
            <SectionAnchor id="fields" label="Request fields" title="Request fields" />
            <div style={{ overflowX: "auto" }}>
              <table>
                <thead>
                  <tr>
                    <th>Field</th>
                    <th>Type</th>
                    <th>Required</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {fields.map(f => (
                    <tr key={f.name}>
                      <td><code>{f.name}</code></td>
                      <td style={{ color: "var(--muted)", fontSize: "0.82rem" }}>{f.type}</td>
                      <td>
                        {f.required
                          ? <span className="badge badge-gold">Required</span>
                          : <span className="badge" style={{ background: "var(--surface-2)", color: "var(--muted)", border: "1px solid var(--border)" }}>Optional</span>}
                      </td>
                      <td style={{ fontSize: "0.85rem", color: "var(--text-2)" }}>{f.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <div className="divider" />

          {/* Responses */}
          <section id="responses" style={{ marginBottom: "3rem" }}>
            <SectionAnchor id="responses" label="Responses" title="Response format" />
            <p style={{ color: "var(--text-2)", fontSize: "0.875rem", lineHeight: 1.7, marginBottom: "1.25rem" }}>
              Every response is JSON with a <code>success</code> boolean and a human-readable <code>message</code>.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--success)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "0.5rem" }}>Success — 200</p>
                <CodeBlock label="response.json" code={`{\n  "success": true,\n  "message": "Message sent successfully."\n}`} />
              </div>
              <div>
                <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--danger)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "0.5rem" }}>Error — 4xx / 5xx</p>
                <CodeBlock label="response.json" code={`{\n  "success": false,\n  "message": "Unauthorized: Invalid API key."\n}`} />
              </div>
            </div>
          </section>

          <div className="divider" />

          {/* Errors */}
          <section id="errors" style={{ marginBottom: "3rem" }}>
            <SectionAnchor id="errors" label="Error reference" title="Error reference" />
            <div style={{ overflowX: "auto" }}>
              <table>
                <thead>
                  <tr>
                    <th>Status</th>
                    <th>Message</th>
                    <th>What to do</th>
                  </tr>
                </thead>
                <tbody>
                  {errors.map(e => (
                    <tr key={e.code}>
                      <td>
                        <span className={`badge ${e.status.startsWith("4") ? "badge-warning" : e.status === "500" ? "" : ""}`}
                          style={e.status === "500" ? { background: "rgba(224,82,82,0.1)", color: "var(--danger)", border: "1px solid rgba(224,82,82,0.2)" } : {}}>
                          {e.status}
                        </span>
                      </td>
                      <td><code style={{ fontSize: "0.78rem" }}>{e.code}</code></td>
                      <td style={{ fontSize: "0.84rem", color: "var(--text-2)" }}>{e.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <div className="divider" />

          {/* Examples */}
          <section id="examples" style={{ marginBottom: "3rem" }}>
            <SectionAnchor id="examples" label="Code examples" title="Code examples" />

            <h3 style={{ fontSize: "0.95rem", fontWeight: 700, marginBottom: "0.75rem", color: "var(--text-2)" }}>Plain HTML form</h3>
            <CodeBlock label="contact.html" code={htmlExample} />

            <h3 style={{ fontSize: "0.95rem", fontWeight: 700, marginBottom: "0.75rem", color: "var(--text-2)" }}>JavaScript / fetch (AJAX)</h3>
            <p style={{ fontSize: "0.84rem", color: "var(--muted)", marginBottom: "0.75rem", lineHeight: 1.6 }}>
              Use this approach to handle the response in JS and show a success/error message without a page reload.
            </p>
            <CodeBlock label="submit.js" code={fetchExample} />

            <h3 style={{ fontSize: "0.95rem", fontWeight: 700, marginBottom: "0.75rem", color: "var(--text-2)" }}>jQuery</h3>
            <CodeBlock label="submit.js" code={jqueryExample} />

            <h3 style={{ fontSize: "0.95rem", fontWeight: 700, marginBottom: "0.75rem", color: "var(--text-2)" }}>cURL (testing)</h3>
            <CodeBlock label="terminal" code={curlExample} />
          </section>

          <div className="divider" />

          {/* Domain setup */}
          <section id="domain" style={{ marginBottom: "3rem" }}>
            <SectionAnchor id="domain" label="Domain setup" title="Registering your domain" />
            <p style={{ color: "var(--text-2)", fontSize: "0.875rem", lineHeight: 1.75, marginBottom: "1rem" }}>
              FormSend checks the <code>Origin</code> header of each browser submission against the domain
              you registered. You need to register the <strong>exact hostname</strong> your site is served from.
            </p>
            <div style={{ overflowX: "auto", marginBottom: "1rem" }}>
              <table>
                <thead><tr><th>Site URL</th><th>Register as</th></tr></thead>
                <tbody>
                  <tr><td><code>https://example.com</code></td><td><code>example.com</code></td></tr>
                  <tr><td><code>https://www.example.com</code></td><td><code>www.example.com</code></td></tr>
                  <tr><td><code>https://app.example.com</code></td><td><code>app.example.com</code></td></tr>
                </tbody>
              </table>
            </div>
            <div className="card" style={{ background: "rgba(224,82,82,0.04)", borderColor: "rgba(224,82,82,0.2)", padding: "1rem 1.25rem" }}>
              <p style={{ fontSize: "0.82rem", color: "var(--text-2)", margin: 0, lineHeight: 1.7 }}>
                <span className="material-icons-round" style={{ fontSize: "0.9rem", verticalAlign: "middle", color: "var(--danger)", marginRight: "0.35rem" }}>warning</span>
                <strong>www vs non-www matters.</strong> If you register <code>example.com</code> but your page is
                served from <code>www.example.com</code>, the submission will be rejected with
                <code> 403 Forbidden: Origin not allowed</code>. Register both separately if needed.
              </p>
            </div>
          </section>

          <div className="divider" />

          {/* FAQ */}
          <section id="faq" style={{ marginBottom: "3rem" }}>
            <SectionAnchor id="faq" label="FAQ" title="Frequently asked questions" />
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {[
                {
                  q: "Do I need a backend or server?",
                  a: "No. The entire integration is client-side HTML. FormSend's API handles everything on the server side.",
                },
                {
                  q: "Can I use it with React, Vue, Webflow, or Framer?",
                  a: "Yes. Any tool that can make an HTTP POST request works. Use the plain HTML snippet, the fetch example, or any HTTP client.",
                },
                {
                  q: "Where does the email go?",
                  a: "To the notification email you registered for the website in the dashboard. Every submission is sent there as a formatted email with all field values.",
                },
                {
                  q: "Can I pass extra fields like phone or company?",
                  a: "Yes. Any field beyond the reserved ones (api_key, name, email, message, subject) is forwarded as an extra row in the email. Just add it to your form.",
                },
                {
                  q: "What is the rate limit?",
                  a: "Submissions are rate-limited per IP address. Hitting the limit returns a 429 with a message asking the user to wait 10 minutes.",
                },
                {
                  q: "My key stopped working after I clicked Rotate key — why?",
                  a: "Key rotation immediately invalidates the old key. You must update your form's api_key hidden input to the new key shown in the dashboard.",
                },
                {
                  q: "I'm getting 403 Forbidden: Origin not allowed. What's wrong?",
                  a: "The hostname in the browser's Origin header doesn't match the domain you registered. Check for www vs non-www mismatches, or a subdomain difference.",
                },
                {
                  q: "Does FormSend store my form submissions?",
                  a: "No. FormSend delivers submissions to your email and does not store message content in any database.",
                },
              ].map(({ q, a }) => (
                <div key={q} className="card" style={{ padding: "1.25rem 1.5rem" }}>
                  <div style={{ fontWeight: 700, fontSize: "0.92rem", marginBottom: "0.45rem", display: "flex", gap: "0.5rem", alignItems: "flex-start" }}>
                    <span style={{ color: "var(--gold)", fontWeight: 800, flexShrink: 0 }}>Q</span>
                    {q}
                  </div>
                  <div style={{ fontSize: "0.86rem", color: "var(--text-2)", lineHeight: 1.7, paddingLeft: "1.4rem" }}>{a}</div>
                </div>
              ))}
            </div>
          </section>

          {/* CTA footer */}
          <div className="card" style={{ background: "rgba(197,160,89,0.04)", borderColor: "var(--gold-border)", padding: "2rem", textAlign: "center" }}>
            <span className="material-icons-round" style={{ fontSize: "2rem", color: "var(--gold)", marginBottom: "0.75rem", display: "block" }}>rocket_launch</span>
            <h3 style={{ fontWeight: 800, fontSize: "1.1rem", marginBottom: "0.5rem" }}>Ready to integrate?</h3>
            <p style={{ color: "var(--muted)", fontSize: "0.875rem", marginBottom: "1.25rem" }}>Sign in, register your website, and have your first form live in under a minute.</p>
            <a href="/dashboard" className="btn-primary">Go to dashboard</a>
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="footer" style={{ marginTop: "2rem" }}>
        <div className="footer-inner">
          <span className="nav-brand" style={{ fontSize: "1rem" }}>
            <span className="material-icons-round" style={{ fontSize: "1rem", verticalAlign: "middle", marginRight: "0.25rem" }}>send</span>
            FormSend
          </span>
          <div className="footer-links">
            <a href="/" className="footer-link">Home</a>
            <a href="#pricing" className="footer-link">Pricing</a>
            <a href="/docs" className="footer-link">Docs</a>
            <a href="/dashboard" className="footer-link">Dashboard</a>
          </div>
          <span className="footer-copy">© {new Date().getFullYear()} FormSend</span>
        </div>
      </footer>
    </>
  );
}
