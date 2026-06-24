'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { AccountDisplay } from '@/components/students/AccountDisplay';
import { TransactionTable } from '@/components/transactions/TransactionTable';
import { PaymentStatusBadge } from '@/components/dashboard/PaymentStatusBadge';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { formatNaira } from '@/lib/constants';
import { useReconciliation } from '@/hooks/useReconciliation';
import { FlaskConical, Copy } from 'lucide-react';

export default function StudentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { triggerReconciliation } = useReconciliation();
  
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [simulating, setSimulating] = useState(false);

  const fetchStudent = async () => {
    try {
      const res = await fetch(`/api/students/${id}`);
      if (!res.ok) throw new Error('Failed to fetch student details');
      const json = await res.json();
      setData(json);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudent();
  }, [id]);

  const handleSimulatePayment = async (duplicate: boolean = false) => {
    if (!data?.virtual_account) return;
    setSimulating(true);
    try {
      const fee = data.fees[0]?.amount_expected || 50000;
      await fetch('/api/mock/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accountRef: data.virtual_account.nomba_account_ref,
          amount: fee,
          senderName: 'Test Parent via Webhook',
          simulate: duplicate ? 'duplicate' : undefined
        })
      });
      // Wait a moment then refresh data
      setTimeout(() => {
        fetchStudent();
        setSimulating(false);
      }, 1500);
    } catch (err) {
      console.error(err);
      setSimulating(false);
    }
  };

  if (loading) return <div className="h-96 skeleton rounded-xl"></div>;
  if (error) return <Alert variant="error">{error}</Alert>;
  if (!data?.student) return <Alert variant="error">Student not found</Alert>;

  const { student, virtual_account, fees, transactions, reconciliation } = data;
  const currentFee = fees[0];
  const currentRecon = reconciliation[0];

  const expected = currentFee?.amount_expected || 0;
  const received = currentRecon?.amount_received || 0;
  const status = currentRecon?.status || 'pending';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card p-6 rounded-xl border border-border shadow-sm">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h2 className="text-2xl font-bold text-foreground">{student.first_name} {student.last_name}</h2>
            <PaymentStatusBadge status={status} />
          </div>
          <p className="text-muted-foreground">Class: {student.class_level || 'N/A'} • {student.parent_email || 'No email'} • {student.parent_phone || 'No phone'}</p>
        </div>
        <div className="flex gap-2">
          {virtual_account && virtual_account.status === 'active' && (
            <>
              <Button variant="outline" onClick={() => handleSimulatePayment(false)} loading={simulating}>
                <FlaskConical size={16} /> Simulate Payment
              </Button>
              <Button variant="secondary" onClick={() => handleSimulatePayment(true)} loading={simulating}>
                <Copy size={16} /> Simulate Duplicate (Idempotency)
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Account & Fee Details */}
        <div className="space-y-6 lg:col-span-1">
          {virtual_account ? (
            <AccountDisplay account={virtual_account} />
          ) : (
            <Card className="p-6 text-center border-dashed">
              <p className="text-muted-foreground">No virtual account assigned</p>
            </Card>
          )}

          <Card className="p-6">
            <h3 className="font-semibold mb-4">Fee Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between border-b border-border/50 pb-2">
                <span className="text-muted-foreground">Expected</span>
                <span className="font-medium text-foreground">{formatNaira(expected)}</span>
              </div>
              <div className="flex justify-between border-b border-border/50 pb-2">
                <span className="text-muted-foreground">Received</span>
                <span className="font-medium text-emerald-500">{formatNaira(received)}</span>
              </div>
              {currentRecon?.shortfall > 0 && (
                <div className="flex justify-between border-b border-border/50 pb-2">
                  <span className="text-muted-foreground">Outstanding</span>
                  <span className="font-bold text-rose-500">{formatNaira(currentRecon.shortfall)}</span>
                </div>
              )}
              {currentRecon?.credit > 0 && (
                <div className="flex justify-between border-b border-border/50 pb-2">
                  <span className="text-muted-foreground">Credit</span>
                  <span className="font-bold text-info">{formatNaira(currentRecon.credit)}</span>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Right Column: Transactions */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-semibold text-lg">Transaction History</h3>
          <TransactionTable 
            transactions={transactions} 
            loading={false} 
            emptyMessage="No payments received yet."
          />
        </div>
      </div>
    </div>
  );
}
