'use client';

import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background print:bg-white">
      <div className="print:hidden">
        <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      </div>
      
      <div className="lg:pl-64 flex flex-col min-h-screen print:pl-0 print:block">
        <div className="print:hidden">
          <Header setMobileOpen={setMobileOpen} />
        </div>
        
        <main className="flex-1 px-4 py-8 sm:px-6 md:py-10 lg:px-8 w-full max-w-7xl mx-auto animate-slide-up print:p-0 print:m-0 print:max-w-none print:animate-none">
          {children}
        </main>
      </div>
    </div>
  );
}
