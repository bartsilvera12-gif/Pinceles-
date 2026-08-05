import type { Metadata } from "next";

// noindex para TODO el panel administrativo.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: "Panel · Pinceles",
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
