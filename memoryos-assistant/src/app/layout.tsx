import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MemoryOS Assistant — Multi-service memory demo",
  description: "One assistant backed by governed context from multiple trusted services.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
