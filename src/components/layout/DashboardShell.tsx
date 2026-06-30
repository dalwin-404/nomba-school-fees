'use client';

import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background print:bg-white relative overflow-hidden">
      {/* Ambient Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 dark:bg-primary/10 rounded-full blur-[120px] pointer-events-none opacity-50 dark:opacity-70 animate-pulse-subtle" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/20 dark:bg-primary/10 rounded-full blur-[120px] pointer-events-none opacity-50 dark:opacity-70 animate-pulse-subtle" style={{ animationDelay: '1s' }} />
      
      <div className="print:hidden relative z-10">
        <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      </div>
      
      <div className={`transition-all duration-300 ease-in-out ${isCollapsed ? 'md:pl-[88px]' : 'md:pl-56'} flex flex-col min-h-screen print:pl-0 print:block`}>
        <div className="print:hidden">
          <Header setMobileOpen={setMobileOpen} isCollapsed={isCollapsed} />
        </div>
        
        <main className="flex-1 px-4 py-8 sm:px-6 md:py-10 lg:px-8 w-full max-w-7xl mx-auto animate-slide-up print:p-0 print:m-0 print:max-w-none print:animate-none">
          {children}
        </main>
      </div>
    </div>
  );
}
