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
    return <Card className="h-64 skeleton" />;
  }

  const { totalStudents, countComplete, countUnderpaid, countOverpaid, countPending } = stats;
  
  const getPercent = (count: number) => {
    if (totalStudents === 0) return 0;
    return Math.round((count / totalStudents) * 100);
  };

  const items = [
    { label: 'Complete', count: countComplete, percent: getPercent(countComplete), colorClass: 'bg-success', textClass: 'text-success' },
    { label: 'Underpaid', count: countUnderpaid, percent: getPercent(countUnderpaid), colorClass: 'bg-warning', textClass: 'text-warning' },
    { label: 'Overpaid', count: countOverpaid, percent: getPercent(countOverpaid), colorClass: 'bg-info', textClass: 'text-info' },
    { label: 'Pending', count: countPending, percent: getPercent(countPending), colorClass: 'bg-muted-foreground/40', textClass: 'text-muted-foreground' },
  ];

  return (
    <Card className="p-6">
      <h3 className="font-semibold text-lg mb-6">Reconciliation Breakdown</h3>
      
      {/* Progress Bar Chart */}
      <div className="w-full h-4 flex rounded-full overflow-hidden mb-6 bg-muted">
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
              <div className={`w-3 h-3 rounded-full ${item.colorClass}`}></div>
              <span className="text-sm font-medium">{item.label}</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold">{item.count}</span>
              <span className="text-xs text-muted-foreground">({item.percent}%)</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
