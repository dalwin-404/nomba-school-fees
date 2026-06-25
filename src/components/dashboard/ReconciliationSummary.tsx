import { Card } from '@/components/ui/Card';

interface ReconciliationSummaryProps {
  stats: {
    totalStudents: number;
    countComplete: number;
    countUnderpaid: number;
    countOverpaid: number;
    countPending: number;
  } | null;
}

export function ReconciliationSummary({ stats }: ReconciliationSummaryProps) {
  if (!stats) {
    return <div className="h-64 skeleton rounded-[24px]" />;
  }

  const { totalStudents, countComplete, countUnderpaid, countOverpaid, countPending } = stats;
  
  const getPercent = (count: number) => {
    if (totalStudents === 0) return 0;
    return Math.round((count / totalStudents) * 100);
  };

  const items = [
    { label: 'Complete', count: countComplete, percent: getPercent(countComplete), colorClass: 'bg-[#34d399]', textClass: 'text-white' },
    { label: 'Underpaid', count: countUnderpaid, percent: getPercent(countUnderpaid), colorClass: 'bg-[#fbbf24]', textClass: 'text-white' },
    { label: 'Overpaid', count: countOverpaid, percent: getPercent(countOverpaid), colorClass: 'bg-[#60a5fa]', textClass: 'text-white' },
    { label: 'Pending', count: countPending, percent: getPercent(countPending), colorClass: 'bg-white/30', textClass: 'text-white/70' },
  ];

  return (
    <div className="rounded-[24px] shadow-sm p-6 bg-[#1d4ed8] text-white animate-fade-in">
      <div className="flex justify-between items-start mb-6">
        <h3 className="font-semibold text-lg">Reconciliation</h3>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
        </div>
      </div>
      
      {/* Progress Bar Chart */}
      <div className="w-full h-2 flex rounded-full overflow-hidden mb-8 bg-black/20">
        {items.map((item) => (
          item.count > 0 && (
            <div 
              key={item.label}
              className={`h-full ${item.colorClass}`}
              style={{ width: `${item.percent}%` }}
              title={`${item.label}: ${item.percent}%`}
            />
          )
        ))}
      </div>
      
      {/* Legend */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {items.map((item) => (
          <div key={item.label} className="flex flex-col">
            <div className="flex items-center gap-2 mb-1">
              <div className={`w-2.5 h-2.5 rounded-full ${item.colorClass}`}></div>
              <span className={`text-sm font-medium ${item.textClass}`}>{item.label}</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold">{item.count}</span>
              <span className="text-xs text-white/60">({item.percent}%)</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
