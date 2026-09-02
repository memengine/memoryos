import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "next-themes";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://memoryo.dev"),
  title: "MemoryOS — Governed memory for production AI agents",
  description:
    "MemoryOS turns relevant conversations, corrections, and events into current, attributable, prompt-ready context. Keep your databases, transcripts, tools, models, and agent framework.",
  keywords: [
    "MemoryOS",
    "AI agent memory",
    "governed context",
    "production AI",
    "agent infrastructure",
    "memory layer",
    "context retrieval",
    "MCP",
    "Memory Passport",
  ],
  authors: [{ name: "MemoryOS" }],
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "MemoryOS — Governed memory for production AI agents",
    description:
      "Give every authorized agent context it can trust. Persistent, governed state for production AI systems.",
    url: "https://memoryo.dev",
    siteName: "MemoryOS",
    type: "website",
    images: ["/og.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "MemoryOS — Governed memory for production AI agents",
    description:
      "Give every authorized agent context it can trust. Persistent, governed state for production AI systems.",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground min-h-screen flex flex-col`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
