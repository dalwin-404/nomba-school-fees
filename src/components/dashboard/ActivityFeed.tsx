'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { formatNaira } from '@/lib/constants';
import { EmptyState } from '@/components/ui/EmptyState';

export function ActivityFeed() {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await fetch('/api/transactions');
        if (res.ok) {
          const data = await res.json();
          // Get the 5 most recent transactions
          const recent = data.transactions.slice(0, 5);
          setActivities(recent);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, []);

  if (loading) {
    return (
      <Card className="p-6 h-full flex flex-col">
        <h3 className="font-semibold text-lg mb-4">Activity Feed</h3>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-full skeleton shrink-0" />
              <div className="space-y-2 flex-1">
                <div className="h-4 w-3/4 skeleton rounded" />
                <div className="h-3 w-1/2 skeleton rounded" />
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 h-full flex flex-col">
      <h3 className="font-semibold text-lg mb-6">Activity Feed</h3>
      <div className="space-y-2 flex-1">
        {activities.length === 0 ? (
          <EmptyState 
            icon={<svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>}
            title="No Activity Yet"
            description="Recent payments and transactions will appear here once they are processed."
          />
        ) : (
          activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-4 p-2 -mx-2 rounded-xl hover:bg-muted/50 transition-colors cursor-default group">
              <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 font-bold text-sm shadow-sm group-hover:scale-105 transition-transform">
                {(activity.students?.first_name?.[0] || 'A').toUpperCase()}
              </div>
              <div className="flex-1 min-w-0 py-0.5">
                <p className="text-sm font-medium text-foreground truncate">
                  Payment from {activity.students?.first_name} {activity.students?.last_name}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  via {activity.channel || 'Nomba'}
                </p>
              </div>
              <div className="text-right shrink-0 py-0.5">
                <p className="text-sm font-bold text-success">
                  +{formatNaira(activity.amount)}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {new Date(activity.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
