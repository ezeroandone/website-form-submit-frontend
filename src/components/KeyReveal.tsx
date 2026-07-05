"use client";

import { useState } from "react";

interface KeyRevealProps {
  apiKey: string;
  domain: string;
  onDismiss: () => void;
}

const API = process.env.NEXT_PUBLIC_API_URL ?? "https://api.formsend.ezeroandone.io";

const DEFAULT_SNIPPET = (apiKey: string) => `<form action="${API}/submit" method="POST">
  <input type="hidden" name="api_key" value="${apiKey}" />
  <input type="text"   name="name"    placeholder="Your name"    required />
  <input type="email"  name="email"   placeholder="Your email"   required />
  <textarea            name="message" placeholder="Your message" required></textarea>
  <button type="submit">Send message</button>
</form>`;

/** Inject api_key into an existing form and point it at FormSend */
function convertForm(html: string, apiKey: string): string {
  const trimmed = html.trim();
  if (!trimmed) return "";

  // Replace or add action on the <form> tag
  let result = trimmed;

  // Update action attribute if it exists
  if (/action\s*=/i.test(result)) {
    result = result.replace(
      /action\s*=\s*["'][^"']*["']/i,
      `action="${API}/submit"`
    );
  } else {
    // Inject action into the opening <form tag
    result = result.replace(/<form(\s)/i, `<form action="${API}/submit"$1`);
  }

  // Ensure method="POST"
  if (/method\s*=/i.test(result)) {
    result = result.replace(/method\s*=\s*["'][^"']*["']/i, `method="POST"`);
  } else {
    result = result.replace(/<form(\s)/i, `<form method="POST"$1`);
  }

  // Remove any existing api_key hidden input to avoid duplicates
  result = result.replace(
    /<input[^>]*name\s*=\s*["']api_key["'][^>]*\/?>/gi,
    ""
  );

  // Inject api_key hidden input right after the opening <form ...> tag
  result = result.replace(
    /(<form[^>]*>)/i,
    `$1\n  <input type="hidden" name="api_key" value="${apiKey}" />`
  );

  return result;
}

/** Detect if the pasted HTML looks like a complete form */
function looksLikeForm(html: string): boolean {
  return /<form[\s>]/i.test(html);
}

export function KeyReveal({ apiKey, domain, onDismiss }: KeyRevealProps) {
  const [keyCopied, setKeyCopied]     = useState(false);
  const [snippetCopied, setSnippetCopied] = useState(false);
  const [convertedCopied, setConvertedCopied] = useState(false);
  const [tab, setTab] = useState<"snippet" | "converter">("snippet");
  const [customHtml, setCustomHtml]   = useState("");
  const [converted, setConverted]     = useState("");
  const [convertError, setConvertError] = useState("");

  const snippet = DEFAULT_SNIPPET(apiKey);

  async function copy(text: string, setter: (v: boolean) => void) {
    try {
      await navigator.clipboard.writeText(text);
      setter(true);
      setTimeout(() => setter(false), 2500);
    } catch {
      // fallback — select the text
    }
  }

  function handleConvert() {
    setConvertError("");
    setConverted("");
    const trimmed = customHtml.trim();
    if (!trimmed) {
      setConvertError("Paste your existing form HTML above first.");
      return;
    }
    if (!looksLikeForm(trimmed)) {
      setConvertError("This doesn't look like a <form> element. Make sure you paste the complete form tag.");
      return;
    }
    const result = convertForm(trimmed, apiKey);
    setConverted(result);
  }

  return (
    <div className="key-reveal" style={{ marginTop: "1.25rem" }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
        <div>
          <div className="key-reveal-label" style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <span className="material-icons-round" style={{ fontSize: "0.9rem" }}>vpn_key</span>
            API key for <strong style={{ color: "var(--text)" }}>{domain}</strong>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.5rem" }}>
            <div className="key-value" style={{ flex: 1, margin: 0, fontFamily: "monospace", fontSize: "0.8rem" }}>{apiKey}</div>
            <button className="btn-primary btn-sm" onClick={() => copy(apiKey, setKeyCopied)} style={{ flexShrink: 0 }}>
              <span className="material-icons-round" style={{ fontSize: "0.85rem" }}>{keyCopied ? "check" : "content_copy"}</span>
              {keyCopied ? "Copied" : "Copy key"}
            </button>
          </div>
        </div>
        <button className="btn-ghost btn-sm" onClick={onDismiss} style={{ marginLeft: "0.5rem", flexShrink: 0 }}>
          <span className="material-icons-round" style={{ fontSize: "0.9rem" }}>close</span>
        </button>
      </div>

      {/* Warning */}
      <div className="key-warning" style={{ marginBottom: "1.25rem" }}>
        <span className="material-icons-round" style={{ fontSize: "0.95rem" }}>warning_amber</span>
        Copy this key now — it will not be shown again after you dismiss this panel.
      </div>

      {/* Tab switcher */}
      <div style={{ display: "flex", gap: "0", marginBottom: "1.25rem", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "3px" }}>
        {(["snippet", "converter"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              flex: 1,
              padding: "0.4rem 0.75rem",
              fontSize: "0.82rem",
              fontWeight: 600,
              borderRadius: "calc(var(--radius) - 2px)",
              background: tab === t ? "var(--surface-2)" : "transparent",
              color: tab === t ? "var(--text)" : "var(--muted)",
              border: tab === t ? "1px solid var(--border)" : "1px solid transparent",
              cursor: "pointer",
              transition: "all 0.15s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.35rem",
            }}
          >
            <span className="material-icons-round" style={{ fontSize: "0.9rem" }}>
              {t === "snippet" ? "integration_instructions" : "auto_fix_high"}
            </span>
            {t === "snippet" ? "Embed snippet" : "Form converter"}
          </button>
        ))}
      </div>

      {/* Tab: Default snippet */}
      {tab === "snippet" && (
        <div>
          <p style={{ fontSize: "0.8rem", color: "var(--muted)", marginBottom: "0.75rem", lineHeight: 1.55 }}>
            Copy this snippet and paste it anywhere on your website. It works with plain HTML, React, Vue, Webflow — anything that renders HTML.
          </p>
          <div className="code-demo">
            <div className="code-demo-header">
              <div className="code-demo-dot" style={{ background: "#ff5f57" }} />
              <div className="code-demo-dot" style={{ background: "#febc2e" }} />
              <div className="code-demo-dot" style={{ background: "#28c840" }} />
              <span style={{ marginLeft: "0.5rem", fontSize: "0.7rem", color: "var(--muted)", fontFamily: "monospace" }}>contact-form.html</span>
            </div>
            <pre style={{ fontSize: "0.75rem", margin: 0 }}>{snippet}</pre>
          </div>
          <button
            className="btn-primary btn-sm"
            style={{ marginTop: "0.75rem" }}
            onClick={() => copy(snippet, setSnippetCopied)}
          >
            <span className="material-icons-round" style={{ fontSize: "0.85rem" }}>{snippetCopied ? "check" : "content_copy"}</span>
            {snippetCopied ? "Copied to clipboard!" : "Copy snippet"}
          </button>
        </div>
      )}

      {/* Tab: Form converter */}
      {tab === "converter" && (
        <div>
          <p style={{ fontSize: "0.8rem", color: "var(--muted)", marginBottom: "1rem", lineHeight: 1.6 }}>
            Already have a form on your website? Paste its HTML below. FormSend will inject the API key and update the form action — ready to drop back in.
          </p>

          <label style={{ fontSize: "0.78rem", color: "var(--muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: "0.4rem" }}>
            Your existing form HTML
          </label>
          <textarea
            rows={8}
            value={customHtml}
            onChange={(e) => { setCustomHtml(e.target.value); setConverted(""); setConvertError(""); }}
            placeholder={`<form action="/contact" method="POST">\n  <input type="text" name="name" placeholder="Name" />\n  <input type="email" name="email" placeholder="Email" />\n  <textarea name="message"></textarea>\n  <button type="submit">Send</button>\n</form>`}
            style={{ fontFamily: "monospace", fontSize: "0.78rem", lineHeight: 1.6, resize: "vertical", minHeight: 160 }}
          />

          {convertError && (
            <div className="error-msg" style={{ marginBottom: "0.5rem" }}>
              <span className="material-icons-round" style={{ fontSize: "1rem" }}>error_outline</span>
              {convertError}
            </div>
          )}

          <button className="btn-primary btn-sm" style={{ marginTop: "0.75rem" }} onClick={handleConvert}>
            <span className="material-icons-round" style={{ fontSize: "0.9rem" }}>auto_fix_high</span>
            Convert form
          </button>

          {converted && (
            <div style={{ marginTop: "1.5rem" }}>
              <label style={{ fontSize: "0.78rem", color: "var(--success)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", display: "flex", alignItems: "center", gap: "0.35rem", marginBottom: "0.5rem" }}>
                <span className="material-icons-round" style={{ fontSize: "0.9rem" }}>check_circle</span>
                Converted — ready to use
              </label>
              <div className="code-demo">
                <div className="code-demo-header">
                  <div className="code-demo-dot" style={{ background: "#ff5f57" }} />
                  <div className="code-demo-dot" style={{ background: "#febc2e" }} />
                  <div className="code-demo-dot" style={{ background: "#28c840" }} />
                  <span style={{ marginLeft: "0.5rem", fontSize: "0.7rem", color: "var(--muted)", fontFamily: "monospace" }}>converted-form.html</span>
                </div>
                <pre style={{ fontSize: "0.73rem", margin: 0, maxHeight: 280, overflowY: "auto" }}>{converted}</pre>
              </div>
              <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem", flexWrap: "wrap" }}>
                <button className="btn-primary btn-sm" onClick={() => copy(converted, setConvertedCopied)}>
                  <span className="material-icons-round" style={{ fontSize: "0.85rem" }}>{convertedCopied ? "check" : "content_copy"}</span>
                  {convertedCopied ? "Copied!" : "Copy converted form"}
                </button>
                <button className="btn-ghost btn-sm" onClick={() => { setCustomHtml(""); setConverted(""); }}>
                  <span className="material-icons-round" style={{ fontSize: "0.85rem" }}>refresh</span>
                  Start over
                </button>
              </div>
              <div style={{ marginTop: "1rem", padding: "0.75rem 1rem", background: "rgba(63,181,116,0.06)", border: "1px solid rgba(63,181,116,0.15)", borderRadius: "var(--radius)", fontSize: "0.8rem", color: "var(--text-2)", lineHeight: 1.6 }}>
                <strong style={{ color: "var(--success)" }}>What changed:</strong> The form <code>action</code> now points to FormSend, the method is set to <code>POST</code>, and a hidden <code>api_key</code> input was added. All your original fields are preserved exactly as they were.
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
