import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { LayoutDashboard, Users, CreditCard, FileText, GraduationCap, LogOut } from 'lucide-react';

export function Sidebar({ mobileOpen, setMobileOpen }: { mobileOpen: boolean, setMobileOpen: (open: boolean) => void }) {
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
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-sidebar-bg text-sidebar-text shadow-xl transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        } flex flex-col`}
      >
        <div className="flex h-20 items-center justify-center border-b border-border px-6">
          <div className="flex items-center justify-center w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-full shadow-sm">
            <GraduationCap className="text-[#6d28d9]" size={22} />
          </div>
          <h1 className="ml-3 text-xl font-bold tracking-tight text-foreground hidden md:block">
            SchoolPay
          </h1>
        </div>

        <nav className="flex-1 overflow-y-auto py-8 px-4 space-y-2">
          {navLinks.map((link) => {
            const isActive = link.href === '/dashboard' 
              ? pathname === '/dashboard' 
              : pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-4 rounded-full px-4 py-3 text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-sidebar-active text-white shadow-md shadow-sidebar-active/20' 
                    : 'text-sidebar-text hover:bg-sidebar-hover hover:text-foreground'
                }`}
                onClick={() => setMobileOpen(false)}
              >
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-sidebar-text'}`}>
                  {link.icon}
                </div>
                {link.name}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-border p-4">
          <button
            onClick={signOut}
            className="flex w-full items-center gap-4 rounded-full px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 dark:hover:text-red-400 transition-colors"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30">
              <LogOut size={18} />
            </div>
            Log Out
          </button>
        </div>
      </aside>
    </>
  );
}
