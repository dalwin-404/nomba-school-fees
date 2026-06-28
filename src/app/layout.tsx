import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { SupabaseProvider } from "@/components/providers/SupabaseProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { CommandPalette } from "@/components/ui/CommandPalette";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SchoolPay - Student Fee Tracker",
  description: "Real-time school fee reconciliation and tracking",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="antialiased" suppressHydrationWarning>
      <body className={`${inter.className} text-sm min-h-screen bg-background text-foreground selection:bg-primary/30`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <SupabaseProvider>
            {children}
            <CommandPalette />
            <Toaster position="bottom-right" richColors theme="system" />
          </SupabaseProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
