import { useState } from 'react';

export function useReconciliation() {
  const [loading, setLoading] = useState(false);

  const triggerReconciliation = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/reconcile', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to reconcile');
      return data;
    } catch (err: any) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getStudentReconciliation = async (studentId: string) => {
    try {
      const res = await fetch(`/api/reconcile/student/${studentId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch student reconciliation');
      return data.reconciliation;
    } catch (err: any) {
      throw err;
    }
  };

  return { triggerReconciliation, getStudentReconciliation, loading };
}
