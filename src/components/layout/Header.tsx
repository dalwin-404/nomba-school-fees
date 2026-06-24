import { useAuth } from '@/hooks/useAuth';
import { usePathname } from 'next/navigation';

export function Header({ setMobileOpen }: { setMobileOpen: (open: boolean) => void }) {
  const pathname = usePathname();
  const { user } = useAuth();
  
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
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-md sm:px-6 lg:px-8">
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

      <div className="flex items-center gap-4">
        <button className="relative rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors focus-ring">
          <span className="sr-only">View notifications</span>
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary animate-pulse-subtle"></span>
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
          </svg>
        </button>
        
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary font-bold shadow-sm ring-1 ring-primary/20">
          {getInitial()}
        </div>
      </div>
    </header>
  );
}
