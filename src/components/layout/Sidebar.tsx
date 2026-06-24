import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { LayoutDashboard, Users, CreditCard, FileText, Zap, LogOut } from 'lucide-react';

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
        <div className="flex h-16 items-center justify-center border-b border-white/10 px-6">
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Zap className="text-primary" size={24} />
            SchoolPay
          </h1>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-sidebar-active text-white' 
                    : 'text-sidebar-text hover:bg-sidebar-hover hover:text-white'
                }`}
                onClick={() => setMobileOpen(false)}
              >
                <span className="flex items-center justify-center w-6 h-6">{link.icon}</span>
                {link.name}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-4">
          <button
            onClick={signOut}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
          >
            <LogOut size={20} />
            Log Out
          </button>
        </div>
      </aside>
    </>
  );
}
