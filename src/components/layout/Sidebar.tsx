import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { LayoutDashboard, Users, CreditCard, FileText, GraduationCap, LogOut, PanelLeftClose, PanelLeftOpen } from 'lucide-react';

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export function Sidebar({ mobileOpen, setMobileOpen, isCollapsed, setIsCollapsed }: SidebarProps) {
  const pathname = usePathname();
  const { signOut } = useAuth();

  const navLinks = [
    { name: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Students', href: '/dashboard/students', icon: <Users size={20} /> },
    { name: 'Transactions', href: '/dashboard/transactions', icon: <CreditCard size={20} /> },
    { name: 'Reports', href: '/dashboard/reports', icon: <FileText size={20} /> },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden animate-fade-in"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed top-0 bottom-0 left-0 z-50 bg-sidebar-bg text-sidebar-text shadow-xl transition-all duration-300 ease-in-out md:translate-x-0 overflow-x-hidden ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        } ${isCollapsed ? 'w-[88px]' : 'w-56'} flex flex-col`}
      >
        <div className="flex h-20 items-center justify-center border-b border-border px-6">
          <div className="flex items-center justify-center w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-full shadow-sm flex-shrink-0">
            <GraduationCap className="text-[#6d28d9]" size={22} />
          </div>
          {!isCollapsed && (
            <h1 className="ml-3 text-xl font-bold tracking-tight text-foreground hidden md:block whitespace-nowrap overflow-hidden transition-all duration-300">
              SchoolPay
            </h1>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto py-8 space-y-2">
          {navLinks.map((link) => {
            const isActive = link.href === '/dashboard' 
              ? pathname === '/dashboard' 
              : pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center rounded-full py-2.5 font-medium transition-colors group relative mx-4 text-sm ${
                  isCollapsed ? 'justify-center px-0 mx-auto w-12 h-12' : 'gap-3 px-3'
                } ${
                  isActive 
                    ? 'bg-sidebar-active text-white shadow-md shadow-sidebar-active/20' 
                    : 'text-sidebar-text hover:bg-sidebar-hover hover:text-foreground'
                }`}
                onClick={() => setMobileOpen(false)}
              >
                <div className={`flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0 ${isActive ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-sidebar-text'}`}>
                  {link.icon}
                </div>
                {!isCollapsed && (
                  <span className="whitespace-nowrap">{link.name}</span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-border p-4 flex flex-col gap-2">
          <button
            onClick={signOut}
            className={`flex items-center rounded-full py-2.5 font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 dark:hover:text-red-400 transition-colors group relative mx-4 text-sm ${
              isCollapsed ? 'justify-center px-0 mx-auto w-12 h-12' : 'gap-3 px-3'
            }`}
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex-shrink-0">
              <LogOut size={18} />
            </div>
            {!isCollapsed && <span className="whitespace-nowrap">Log Out</span>}
          </button>
          
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex w-full items-center justify-center py-2 mt-2 text-muted-foreground hover:text-foreground transition-colors bg-muted/50 hover:bg-muted rounded-md"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
          </button>
        </div>
      </aside>
    </>
  );
}
