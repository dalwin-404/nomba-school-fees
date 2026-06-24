'use client';

import { useEffect, useState } from 'react';
import { TransactionTable } from '@/components/transactions/TransactionTable';
import { Alert } from '@/components/ui/Alert';

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await fetch('/api/transactions');
        if (!res.ok) throw new Error('Failed to fetch transactions');
        const data = await res.json();
        setTransactions(data.transactions || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">All Transactions</h2>
        <p className="text-sm text-muted-foreground">Inbound transfers across all virtual accounts</p>
      </div>

      {error && <Alert variant="error">{error}</Alert>}

      <TransactionTable transactions={transactions} loading={loading} />
    </div>
  );
}
