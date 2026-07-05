import type { Metadata, Viewport } from "next";
import "./globals.css";

const BASE_URL = "https://formsend.ezeroandone.io";

export const viewport: Viewport = {
  themeColor: "#C5A059",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),

  title: {
    default: "FormSend — Contact Forms Without a Backend",
    template: "%s | FormSend",
  },
  description:
    "Add a working contact form to any website in 60 seconds. No server, no hosting, no code. FormSend handles email delivery, security, and verification — paste one HTML snippet and you're live.",

  keywords: [
    "contact form",
    "form backend",
    "form API",
    "HTML form email",
    "form submission service",
    "no backend form",
    "FormSend",
    "static site form",
    "Webflow form",
    "Framer form",
  ],

  authors: [{ name: "FormSend", url: BASE_URL }],
  creator: "FormSend",
  publisher: "FormSend",

  alternates: {
    canonical: BASE_URL,
  },

  openGraph: {
    type: "website",
    url: BASE_URL,
    siteName: "FormSend",
    title: "FormSend — Contact Forms Without a Backend",
    description:
      "Add a working contact form to any website in 60 seconds. No server, no code required. Paste one HTML snippet, verify your email, and form submissions land straight in your inbox.",
    images: [
      {
        url: `${BASE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "FormSend — Contact Forms Without a Backend",
      },
    ],
    locale: "en_US",
  },

  twitter: {
    card: "summary_large_image",
    title: "FormSend — Contact Forms Without a Backend",
    description:
      "Add a working contact form to any website in 60 seconds. No server, no code required.",
    images: [`${BASE_URL}/og-image.png`],
    creator: "@ezeroandone",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: "/apple-touch-icon.png",
    shortcut: "/favicon.ico",
  },

  manifest: "/site.webmanifest",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Round" rel="stylesheet" />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
