'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useDashboard } from '@/hooks/useDashboard';
import { useReconciliation } from '@/hooks/useReconciliation';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { RevenueChart } from '@/components/dashboard/RevenueChart';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { ReconciliationSummary } from '@/components/dashboard/ReconciliationSummary';
import { StudentCard } from '@/components/students/StudentCard';
import { StudentCardSkeleton } from '@/components/students/StudentCardSkeleton';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { EmptyState } from '@/components/ui/EmptyState';
import { FlaskConical, RefreshCw, Plus, Users as UsersIcon, Banknote, Download } from 'lucide-react';
import { toast } from 'sonner';

export default function DashboardPage() {
  const { stats, loading, error, fetchDashboard } = useDashboard();
  const { triggerReconciliation, loading: reconciling } = useReconciliation();
  const [demoLoading, setDemoLoading] = useState(false);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const handleReconcile = async () => {
    toast.promise(
      (async () => {
        await triggerReconciliation();
        await fetchDashboard();
      })(),
      {
        loading: 'Reconciling payments...',
        success: 'Reconciliation complete!',
        error: 'Failed to reconcile payments',
      }
    );
  };

  const handleDemoSetup = async () => {
    setDemoLoading(true);
    toast.promise(
      (async () => {
        await fetch('/api/mock/demo-setup', { method: 'POST' });
        await fetchDashboard();
      })(),
      {
        loading: 'Generating demo data...',
        success: 'Demo data generated successfully!',
        error: 'Failed to generate demo data',
        finally: () => setDemoLoading(false),
      }
    );
  };

  const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div className="space-y-6">
      {error && <Alert variant="error">{error}</Alert>}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Good morning, Admin 👋</h2>
          <p className="text-muted-foreground mt-1">Here is your school&apos;s financial overview for {currentDate}.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {/* Note: In a real app we'd pass NOMBA_PROVIDER down via an env check or API, but for hackathon demo we just show it */}
          <Button variant="outline" size="sm" onClick={handleDemoSetup} loading={demoLoading}>
            <FlaskConical size={16} /> Generate Demo Data
          </Button>
          <Button variant="secondary" size="sm" onClick={handleReconcile} loading={reconciling}>
            <RefreshCw size={16} /> Reconcile All
          </Button>
        </div>
      </div>

      {/* Quick Actions Bar */}
      <div className="flex flex-wrap gap-3 mb-6 p-1">
        <Link href="/dashboard/students/new">
          <Button variant="primary" className="shadow-md hover:shadow-lg transition-shadow">
            <Plus size={16} className="mr-2" /> Add Student
          </Button>
        </Link>
        <Link href="/dashboard/students">
          <Button variant="outline" className="bg-card shadow-sm hover:shadow-md transition-shadow">
            <Banknote size={16} className="mr-2 text-primary" /> Record Payment
          </Button>
        </Link>
        <Link href="/dashboard/reports">
          <Button variant="outline" className="bg-card shadow-sm hover:shadow-md transition-shadow">
            <Download size={16} className="mr-2 text-primary" /> Download Reports
          </Button>
        </Link>
      </div>

      <DashboardStats stats={stats} />

      <div className="mb-6">
        <RevenueChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg">Recent Students</h3>
            <Link href="/dashboard/students" className="text-sm text-primary hover:underline">
              View all
            </Link>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map(i => <StudentCardSkeleton key={i} />)}
            </div>
          ) : stats?.students?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {stats.students.slice(0, 4).map((student: any) => (
                <StudentCard key={student.id} student={student} />
              ))}
            </div>
          ) : (
            <div className="border border-dashed border-border rounded-xl h-48">
              <EmptyState 
                icon={<UsersIcon size={24} />}
                title="No Students Yet"
                description="Add your first student to start tracking fees."
                action={
                  <Link href="/dashboard/students/new">
                    <Button variant="outline" size="sm">Add Student</Button>
                  </Link>
                }
              />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-6">
          <ActivityFeed />
          <ReconciliationSummary stats={stats} />
        </div>
      </div>
    </div>
  );
}
