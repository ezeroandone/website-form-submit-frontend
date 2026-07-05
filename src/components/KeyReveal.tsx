"use client";

import { useState } from "react";

interface KeyRevealProps {
  apiKey: string;
  domain: string;
  onDismiss: () => void;
}

const API = process.env.NEXT_PUBLIC_API_URL ?? "https://api.formsend.ezeroandone.io";

export function KeyReveal({ apiKey, domain, onDismiss }: KeyRevealProps) {
  const [copied, setCopied] = useState(false);
  const [snippetCopied, setSnippetCopied] = useState(false);

  const snippet = `<form action="${API}/submit" method="POST">
  <input type="hidden" name="api_key" value="${apiKey}" />
  <input type="text"   name="name"    placeholder="Your name"    required />
  <input type="email"  name="email"   placeholder="Your email"   required />
  <textarea            name="message" placeholder="Your message" required></textarea>
  <button type="submit">Send</button>
</form>`;

  const copy = async (text: string, setter: (v: boolean) => void) => {
    await navigator.clipboard.writeText(text);
    setter(true);
    setTimeout(() => setter(false), 2000);
  };

  return (
    <div className="key-reveal" style={{ marginTop: "1rem" }}>
      <p>🔑 Your API key for <strong>{domain}</strong></p>
      <div className="key-value">{apiKey}</div>
      <div className="key-warning">
        ⚠️ Copy this now — it will not be shown again.
      </div>
      <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem", flexWrap: "wrap" }}>
        <button className="btn-primary btn-sm" onClick={() => copy(apiKey, setCopied)}>
          {copied ? "✓ Copied!" : "Copy key"}
        </button>
        <button className="btn-ghost btn-sm" onClick={() => copy(snippet, setSnippetCopied)}>
          {snippetCopied ? "✓ Copied!" : "Copy embed snippet"}
        </button>
        <button className="btn-ghost btn-sm" onClick={onDismiss}>Dismiss</button>
      </div>

      <div style={{ marginTop: "1.25rem" }}>
        <p style={{ fontSize: "0.8rem", color: "var(--muted)", marginBottom: "0.5rem" }}>Embed snippet:</p>
        <pre style={{ fontSize: "0.75rem" }}>{snippet}</pre>
      </div>
    </div>
  );
}
