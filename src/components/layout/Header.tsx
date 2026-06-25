import { useAuth } from '@/hooks/useAuth';
import { usePathname } from 'next/navigation';
import { Bell, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';

export function Header({ setMobileOpen }: { setMobileOpen: (open: boolean) => void }) {
  const pathname = usePathname();
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setMounted(true);
    
    // Fetch recent successful transactions
    const fetchNotifications = async () => {
      try {
        const res = await fetch('/api/transactions');
        if (res.ok) {
          const data = await res.json();
          // Get 5 most recent successful
          const recent = data.transactions
            .filter((t: any) => t.status === 'confirmed')
            .slice(0, 5);
          setNotifications(recent);
        }
      } catch (err) {
        console.error('Failed to fetch notifications', err);
      }
    };
    
    fetchNotifications();
  }, []);
  
  // Create a readable title based on path
  const getPageTitle = () => {
    if (pathname === '/dashboard') return 'Dashboard Overview';
    if (pathname.includes('/students/new')) return 'Add New Student';
    if (pathname.includes('/students/')) return 'Student Details';
    if (pathname.includes('/students')) return 'Students List';
    if (pathname.includes('/transactions')) return 'Recent Transactions';
    if (pathname.includes('/reports')) return 'Reports & Analytics';
    return 'Dashboard';
  };

  const getInitial = () => {
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'A';
  };

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between bg-background px-4 sm:px-6 lg:px-8">
      <div className="flex items-center gap-4">
        <button
          type="button"
          className="text-muted-foreground hover:text-foreground focus:outline-none lg:hidden"
          onClick={() => setMobileOpen(true)}
        >
          <span className="sr-only">Open sidebar</span>
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
        <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl animate-fade-in">
          {getPageTitle()}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        {mounted && (
          <button 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white dark:bg-slate-800 text-muted-foreground hover:text-foreground transition-colors shadow-sm"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        )}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white dark:bg-slate-800 text-muted-foreground hover:text-foreground transition-colors shadow-sm"
          >
            <span className="sr-only">View notifications</span>
            {notifications.length > 0 && (
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 animate-pulse-subtle"></span>
            )}
            <Bell size={18} />
          </button>
          
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-card rounded-2xl shadow-xl border border-border overflow-hidden z-50 animate-fade-in">
              <div className="p-4 border-b border-border bg-muted/30">
                <h3 className="font-semibold text-foreground">Recent Payments</h3>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-muted-foreground text-sm">
                    No recent payments found.
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div key={notif.id} className="p-4 border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                      <p className="text-sm text-foreground">
                        Payment of <span className="font-bold text-success">₦{notif.amount.toLocaleString()}</span> received for <span className="font-semibold">{notif.students?.first_name} {notif.students?.last_name}</span>.
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(notif.created_at).toLocaleString()}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
        
        <Link href="/dashboard/settings" className="flex items-center gap-3 ml-2 p-1 pr-4 rounded-full bg-white dark:bg-slate-800 shadow-sm hover:shadow-md transition-shadow border border-slate-100 dark:border-slate-700 cursor-pointer">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1d4ed8] text-white font-bold shadow-inner">
            {getInitial()}
          </div>
          <div className="hidden md:flex flex-col">
            <span className="text-sm font-semibold text-foreground leading-tight">{user?.user_metadata?.schoolName || 'Admin School'}</span>
            <span className="text-xs text-muted-foreground leading-tight">Administrator</span>
          </div>
        </Link>
      </div>
    </header>
  );
}
