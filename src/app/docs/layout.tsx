import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "API Documentation",
  description:
    "Complete FormSend API reference. Learn how to integrate a contact form into any website using HTML, JavaScript, or any HTTP client. Covers fields, error codes, CORS, and code examples.",
  alternates: {
    canonical: "https://formsend.ezeroandone.io/docs",
  },
  openGraph: {
    title: "FormSend API Docs — Integrate a Contact Form in 60 Seconds",
    description:
      "Full API reference for FormSend: endpoint, request fields, error codes, and code examples in plain HTML, JS fetch, jQuery, and cURL.",
    url: "https://formsend.ezeroandone.io/docs",
  },
};

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
