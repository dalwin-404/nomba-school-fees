import { formatNaira } from '@/lib/constants';
import { Card } from '@/components/ui/Card';
import { Users, Banknote, CheckCircle, AlertTriangle } from 'lucide-react';

interface DashboardStatsProps {
  totalStudents: number;
  totalExpected: number;
  totalReceived: number;
  countPending: number;
}

export function DashboardStats({ stats }: { stats: DashboardStatsProps | null }) {
  if (!stats) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="h-28 skeleton" />
        ))}
      </div>
    );
  }

  const outstanding = Math.max(0, stats.totalExpected - stats.totalReceived);

  const cards = [
    {
      title: 'Total Students',
      value: stats.totalStudents.toLocaleString(),
      icon: <Users size={24} />,
      colorClass: 'text-primary',
      bgClass: 'bg-primary/10',
    },
    {
      title: 'Expected Fees',
      value: formatNaira(stats.totalExpected),
      icon: <Banknote size={24} />,
      colorClass: 'text-amber-500',
      bgClass: 'bg-amber-500/10',
    },
    {
      title: 'Received Fees',
      value: formatNaira(stats.totalReceived),
      icon: <CheckCircle size={24} />,
      colorClass: 'text-emerald-500',
      bgClass: 'bg-emerald-500/10',
    },
    {
      title: 'Outstanding',
      value: formatNaira(outstanding),
      icon: <AlertTriangle size={24} />,
      colorClass: 'text-rose-500',
      bgClass: 'bg-rose-500/10',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
      {cards.map((card) => (
        <Card key={card.title} className="p-6 transition-default hover:-translate-y-1 hover:shadow-lg">
          <div className="flex items-center gap-4">
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${card.bgClass} ${card.colorClass} text-2xl`}>
              {card.icon}
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">{card.title}</p>
              <p className="text-2xl font-bold text-foreground mt-1">{card.value}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
