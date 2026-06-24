import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { PaymentStatusBadge } from './PaymentStatusBadge';
import { formatNaira } from '@/lib/constants';

interface StudentCardProps {
  student: {
    id: string;
    name: string;
    classLevel: string;
    accountNumber: string;
    expected: number;
    received: number;
    status: string;
  };
}

export function StudentCard({ student }: StudentCardProps) {
  const percentPaid = student.expected > 0 ? Math.min(100, Math.round((student.received / student.expected) * 100)) : 0;
  
  return (
    <Link href={`/dashboard/students/${student.id}`}>
      <Card className="p-5 transition-default hover:-translate-y-1 hover:border-primary/50 hover:shadow-md h-full flex flex-col cursor-pointer group">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
              {student.name}
            </h3>
            <p className="text-sm text-muted-foreground">{student.classLevel}</p>
          </div>
          <PaymentStatusBadge status={student.status} />
        </div>
        
        <div className="mb-4 bg-muted/50 p-2 rounded-md border border-border/50 text-center">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">NUBAN</p>
          <p className="font-mono font-medium text-foreground tracking-widest">{student.accountNumber || 'Pending...'}</p>
        </div>
        
        <div className="mt-auto">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Paid: <span className="font-medium text-foreground">{formatNaira(student.received)}</span></span>
            <span className="text-muted-foreground">Total: <span className="font-medium text-foreground">{formatNaira(student.expected)}</span></span>
          </div>
          
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <div 
              className={`h-2 rounded-full ${
                percentPaid === 100 ? 'bg-success' : percentPaid > 0 ? 'bg-warning' : 'bg-muted-foreground/30'
              }`}
              style={{ width: `${percentPaid}%` }}
            ></div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
