'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useDashboard } from '@/hooks/useDashboard';
import { useReconciliation } from '@/hooks/useReconciliation';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { ReconciliationSummary } from '@/components/dashboard/ReconciliationSummary';
import { StudentCard } from '@/components/dashboard/StudentCard';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { FlaskConical, RefreshCw, Plus } from 'lucide-react';

export default function DashboardPage() {
  const { stats, loading, error, fetchDashboard } = useDashboard();
  const { triggerReconciliation, loading: reconciling } = useReconciliation();
  const [demoLoading, setDemoLoading] = useState(false);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const handleReconcile = async () => {
    try {
      await triggerReconciliation();
      await fetchDashboard();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDemoSetup = async () => {
    setDemoLoading(true);
    try {
      await fetch('/api/mock/demo-setup', { method: 'POST' });
      await fetchDashboard();
    } catch (err) {
      console.error(err);
    } finally {
      setDemoLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {error && <Alert variant="error">{error}</Alert>}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <h2 className="text-xl font-bold">Overview</h2>
        <div className="flex flex-wrap gap-2">
          {/* Note: In a real app we'd pass NOMBA_PROVIDER down via an env check or API, but for hackathon demo we just show it */}
          <Button variant="outline" size="sm" onClick={handleDemoSetup} loading={demoLoading}>
            <FlaskConical size={16} /> Generate Demo Data
          </Button>
          <Button variant="secondary" size="sm" onClick={handleReconcile} loading={reconciling}>
            <RefreshCw size={16} /> Reconcile All
          </Button>
          <Link href="/dashboard/students/new">
            <Button size="sm"><Plus size={16} /> Add Student</Button>
          </Link>
        </div>
      </div>

      <DashboardStats stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg">Recent Students</h3>
            <Link href="/dashboard/students" className="text-sm text-primary hover:underline">
              View all
            </Link>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map(i => <div key={i} className="h-40 skeleton rounded-xl" />)}
            </div>
          ) : stats?.students?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {stats.students.slice(0, 4).map((student: any) => (
                <StudentCard key={student.id} student={student} />
              ))}
            </div>
          ) : (
            <div className="text-center p-8 border border-dashed border-border rounded-xl">
              <p className="text-muted-foreground mb-4">No students found.</p>
              <Link href="/dashboard/students/new">
                <Button variant="outline">Add your first student</Button>
              </Link>
            </div>
          )}
        </div>

        <div>
          <ReconciliationSummary stats={stats} />
        </div>
      </div>
    </div>
  );
}
