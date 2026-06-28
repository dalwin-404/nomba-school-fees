import { formatNaira } from '@/lib/constants';
import { Card } from '@/components/ui/Card';
import { Users, Banknote, CheckCircle, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';

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
      trend: '+12%',
      trendUp: true,
    },
    {
      title: 'Expected Fees',
      value: formatNaira(stats.totalExpected),
      icon: <Banknote size={24} />,
      colorClass: 'text-amber-500',
      bgClass: 'bg-amber-500/10',
      trend: '+5.2%',
      trendUp: true,
    },
    {
      title: 'Received Fees',
      value: formatNaira(stats.totalReceived),
      icon: <CheckCircle size={24} />,
      colorClass: 'text-emerald-500',
      bgClass: 'bg-emerald-500/10',
      trend: '+18%',
      trendUp: true,
    },
    {
      title: 'Outstanding',
      value: formatNaira(outstanding),
      icon: <AlertTriangle size={24} />,
      colorClass: 'text-rose-500',
      bgClass: 'bg-rose-500/10',
      trend: '-2.4%',
      trendUp: false,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
      {cards.map((card) => (
        <Card key={card.title} className="p-6 transition-default hover:-translate-y-1 hover:shadow-lg flex items-center gap-5">
          <div className="flex-shrink-0 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-600">
            {card.icon}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-col mb-1 overflow-hidden">
              <p className="text-xl xl:text-2xl font-bold text-foreground leading-none truncate" title={card.value}>{card.value}</p>
            </div>
            <p className="text-xs font-medium text-muted-foreground leading-tight flex items-center gap-1.5 mt-2 cursor-help" title={`Data for ${card.title}`}>
              <span className={`inline-flex items-center gap-0.5 font-bold ${card.trendUp ? 'text-emerald-500' : 'text-rose-500'}`}>
                {card.trendUp ? <TrendingUp size={12} strokeWidth={3} /> : <TrendingDown size={12} strokeWidth={3} />}
                {card.trend}
              </span>
              <span>{card.title}</span>
            </p>
          </div>
        </Card>
      ))}
    </div>
  );
}
