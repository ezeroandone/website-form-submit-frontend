import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FormSend — Simple Form Submission API",
  description:
    "Add a contact form to any website in minutes. No backend needed. Powered by FormSend.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
