import type { Metadata } from "next";
import "./globals.css";
import { SupabaseProvider } from "@/components/providers/SupabaseProvider";

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
      <body className="min-h-screen bg-background text-foreground selection:bg-primary/30">
        <SupabaseProvider>
          {children}
        </SupabaseProvider>
      </body>
    </html>
  );
}
