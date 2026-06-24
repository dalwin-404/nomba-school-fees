'use client';

import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      
      <div className="lg:pl-64 flex flex-col min-h-screen">
        <Header setMobileOpen={setMobileOpen} />
        
        <main className="flex-1 px-4 py-8 sm:px-6 md:py-10 lg:px-8 w-full max-w-7xl mx-auto animate-slide-up">
          {children}
        </main>
      </div>
    </div>
  );
}
