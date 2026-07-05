import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing — Pay Once, Keep Forever",
  description:
    "FormSend pricing: free for one website, $1 for 5, $5 for 50. One-time payment, no monthly fees, unlimited form submissions on every plan.",
  alternates: {
    canonical: "https://formsend.ezeroandone.io/pricing",
  },
  openGraph: {
    title: "FormSend Pricing — Pay Once, Keep Forever",
    description:
      "Free for one site. $1 for 5 websites. $5 for 50. One-time purchase, no subscriptions, unlimited submissions.",
    url: "https://formsend.ezeroandone.io/pricing",
  },
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
