import { Provider } from "jotai";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Toaster } from "@/components/ui/sonner";
import { TRPCReactProvider } from "@/trpc/client";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Flowbase",
    template: "Flowbase | %s",
  },
  description: "Flowbase is a workflow automation platform for building, running, and scaling app and AI automations.",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/logos/logo.svg",
    shortcut: "/logos/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <TRPCReactProvider>
          <NuqsAdapter>
            <Provider>
              {children}
              <Toaster />
            </Provider>
          </NuqsAdapter>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
