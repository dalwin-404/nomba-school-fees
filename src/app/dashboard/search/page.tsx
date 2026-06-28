'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { StudentCard } from '@/components/students/StudentCard';
import { TransactionTable } from '@/components/transactions/TransactionTable';
import { Alert } from '@/components/ui/Alert';

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<{ students: any[], transactions: any[] }>({
    students: [],
    transactions: []
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query) {
      setLoading(false);
      return;
    }

    const fetchSearchResults = async () => {
      setLoading(true);
      try {
        // Fetch students and transactions
        const [studentsRes, txnsRes] = await Promise.all([
          fetch('/api/reports/dashboard'),
          fetch('/api/transactions')
        ]);

        if (!studentsRes.ok || !txnsRes.ok) throw new Error('Failed to fetch search results');

        const [studentsData, txnsData] = await Promise.all([
          studentsRes.json(),
          txnsRes.json()
        ]);

        const q = query.toLowerCase();

        // Filter students from dashboard endpoint (which returns mapped students)
        const matchedStudents = (studentsData.students || []).filter((s: any) => {
          const name = (s.name || '').toLowerCase();
          const account = (s.accountNumber || '').toLowerCase();
          return name.includes(q) || account.includes(q);
        });

        // Filter transactions
        const matchedTxns = (txnsData.transactions || []).filter((t: any) => {
          const studentName = t.students ? `${t.students.first_name} ${t.students.last_name}`.toLowerCase() : '';
          const ref = (t.nomba_txn_ref || '').toLowerCase();
          return studentName.includes(q) || ref.includes(q);
        });

        setResults({
          students: matchedStudents,
          transactions: matchedTxns
        });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-2">Search Results</h2>
        <p className="text-muted-foreground">
          Showing results for &quot;<span className="font-semibold text-foreground">{query}</span>&quot;
        </p>
      </div>

      {error && <Alert variant="error">{error}</Alert>}

      {/* Students Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold border-b border-border pb-2">Matched Students ({results.students.length})</h3>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="h-40 skeleton rounded-xl" />
            <div className="h-40 skeleton rounded-xl" />
          </div>
        ) : results.students.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.students.map((student) => (
              <StudentCard key={student.id} student={student} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground italic">No students matched your query.</p>
        )}
      </div>

      {/* Transactions Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold border-b border-border pb-2">Matched Transactions ({results.transactions.length})</h3>
        <TransactionTable 
          transactions={results.transactions} 
          loading={loading} 
          emptyMessage="No transactions matched your query." 
        />
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="h-64 rounded-xl skeleton w-full"></div>}>
      <SearchContent />
    </Suspense>
  );
}
