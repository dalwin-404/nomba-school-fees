'use client';

import { useEffect } from 'react';
import { useDashboard } from '@/hooks/useDashboard';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { ReconciliationSummary } from '@/components/dashboard/ReconciliationSummary';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';

export default function ReportsPage() {
  const { stats, loading, error, fetchDashboard } = useDashboard();

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const handleExportCSV = () => {
    if (!stats || !stats.students) return;

    const headers = ['Name', 'Class Level', 'Account Number', 'Status', 'Expected', 'Received', 'Shortfall'];
    const rows = stats.students.map((s: any) => [
      s.name,
      s.classLevel,
      s.accountNumber,
      s.status,
      s.expected,
      s.received,
      s.shortfall || 0
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row: any[]) => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `school_fees_report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">Reports & Analytics</h2>
          <p className="text-sm text-muted-foreground">Comprehensive view of fee collection</p>
        </div>
        <Button onClick={handleExportCSV} disabled={loading || !stats?.students?.length}>
          📥 Export CSV
        </Button>
      </div>

      {error && <Alert variant="error">{error}</Alert>}

      <DashboardStats stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <ReconciliationSummary stats={stats} />
        </div>
        {/* Placeholder for more charts in a real app */}
        <div className="bg-card rounded-xl border border-border p-6 flex items-center justify-center text-center text-muted-foreground min-h-[300px]">
          <div>
            <p className="text-4xl mb-3">📊</p>
            <p>More detailed class-level analytics<br/>coming soon.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
