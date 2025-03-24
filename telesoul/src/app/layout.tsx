import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ClientNav } from "@/components/layout/client-nav";
import type { Metadata } from "next";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TeleSoul",
  description: "Connect with your soul mate",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-TW" className="light" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider defaultTheme="light" storageKey="app-theme">
          <div className="min-h-screen bg-background">
            {children}
            <ClientNav />
            <Toaster />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
