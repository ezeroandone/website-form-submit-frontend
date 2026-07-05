import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FormSend — Contact Forms Without a Backend",
  description:
    "Add a working contact form to any website in 60 seconds. No server, no hosting, no complexity. FormSend handles delivery, security, and verification — you just embed the form.",
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
