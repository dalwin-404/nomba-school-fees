import Link from 'next/link';
import { PaymentStatusBadge } from '@/components/dashboard/PaymentStatusBadge';
import { formatNaira } from '@/lib/constants';

interface StudentCardProps {
  student: any;
}

const colorThemes = [
  { text: 'text-blue-600', bg: 'bg-blue-600', fill: 'fill-blue-600' },
  { text: 'text-purple-600', bg: 'bg-purple-600', fill: 'fill-purple-600' },
  { text: 'text-emerald-500', bg: 'bg-emerald-500', fill: 'fill-emerald-500' },
  { text: 'text-rose-500', bg: 'bg-rose-500', fill: 'fill-rose-500' },
  { text: 'text-amber-500', bg: 'bg-amber-500', fill: 'fill-amber-500' },
];

export function StudentCard({ student }: StudentCardProps) {
  // Pick a random color based on student ID string so it's consistent
  const colorIndex = student.id ? student.id.charCodeAt(0) % colorThemes.length : 0;
  const theme = colorThemes[colorIndex];

  // Normalize data for both raw DB row and dashboard mapped row
  const firstName = student.first_name || (student.name ? student.name.split(' ')[0] : 'Unknown');
  const lastName = student.last_name || (student.name ? student.name.split(' ').slice(1).join(' ') : '');
  const classLevel = student.class_level || student.classLevel || 'No Class';
  const accountNo = student.virtual_accounts?.[0]?.account_number || student.accountNumber;
  const expected = student.reconciliation_log?.[0]?.amount_expected || student.expected || 0;
  const received = student.reconciliation_log?.[0]?.amount_received || student.received || 0;
  const status = student.reconciliation_log?.[0]?.status || student.status || 'pending';

  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  const percentPaid = expected > 0 ? Math.min(100, Math.round((received / expected) * 100)) : 0;
  const ringColor = percentPaid >= 100 ? 'text-emerald-500' : percentPaid > 0 ? 'text-amber-500' : 'text-rose-500';

  return (
    <Link href={`/dashboard/students/${student.id}`} className="block group">
      <div className="relative w-full h-48 bg-card rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden border border-border">
        
        {/* Wavy Background SVG */}
        <div className="absolute inset-0 z-0">
          <svg className={`w-full h-full ${theme.text}`} preserveAspectRatio="none" viewBox="0 0 100 100">
            {/* A smooth wave that covers the left ~65% of the card */}
            <path 
              className="fill-current"
              d="M0,0 L65,0 C50,40 80,60 60,100 L0,100 Z" 
            />
          </svg>
        </div>

        {/* Content Container */}
        <div className="relative z-10 flex h-full p-5">
          
          {/* Left Side (Text over color) */}
          <div className="flex-1 flex flex-col justify-between pr-4">
            <div>
              <h3 className="text-xl font-bold text-white leading-tight drop-shadow-sm line-clamp-1">
                {firstName}
              </h3>
              <h3 className="text-xl font-bold text-white leading-tight drop-shadow-sm mb-1 line-clamp-1">
                {lastName}
              </h3>
              <p className="text-white/90 text-sm font-medium drop-shadow-sm">
                {classLevel}
              </p>
            </div>
            
            <div className="flex flex-col gap-1.5 mt-auto">
              {/* Payment Info */}
              <div className="flex items-center gap-2">
                <span className="text-white/80 text-xs uppercase font-bold tracking-wider">Paid:</span>
                <span className="text-white font-bold">{formatNaira(received)}</span>
              </div>
              <div className="flex items-center gap-2">
                <PaymentStatusBadge status={status} />
              </div>
            </div>
          </div>

          {/* Right Side (Avatar over card background) */}
          <div className="w-24 flex flex-col items-center justify-center pl-2">
            <div className="relative w-20 h-20 transform group-hover:scale-110 transition-transform duration-300">
              {/* Circular Progress Ring */}
              <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="46" fill="transparent" stroke="currentColor" strokeWidth="6" className="text-muted/30" />
                <circle 
                  cx="50" cy="50" r="46" fill="transparent" stroke="currentColor" strokeWidth="6" 
                  strokeLinecap="round"
                  className={ringColor}
                  strokeDasharray={`${percentPaid * 2.89} 289`}
                />
              </svg>
              {/* Avatar Center */}
              <div className="absolute inset-2 rounded-full border-[3px] border-card bg-slate-100 flex items-center justify-center overflow-hidden">
                <span className={`text-2xl font-black ${theme.text} opacity-80`}>
                  {initials}
                </span>
              </div>
            </div>
            {accountNo && (
              <div className="mt-3 text-center">
                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-0.5">Account</p>
                <p className="text-xs font-mono font-semibold text-foreground bg-muted px-1.5 py-0.5 rounded">{accountNo}</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </Link>
  );
}
