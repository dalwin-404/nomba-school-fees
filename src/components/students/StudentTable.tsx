import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Input } from '@/components/ui/Input';
import { PaymentStatusBadge } from '@/components/dashboard/PaymentStatusBadge';
import { formatNaira } from '@/lib/constants';

interface StudentTableProps {
  students: any[];
  loading: boolean;
}

export function StudentTable({ students, loading }: StudentTableProps) {
  const router = useRouter();
  const [search, setSearch] = useState('');

  const filtered = students.filter(s => {
    const fullName = `${s.first_name} ${s.last_name}`.toLowerCase();
    const account = (s.virtual_accounts?.[0]?.account_number || '').toLowerCase();
    const q = search.toLowerCase();
    return fullName.includes(q) || account.includes(q);
  });

  if (loading) {
    return <div className="h-64 rounded-xl skeleton w-full"></div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="w-full max-w-sm">
          <Input 
            placeholder="Search by name or NUBAN..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leadingIcon={
              <svg className="w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            }
          />
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Class</TableHead>
              <TableHead>Virtual Account</TableHead>
              <TableHead className="text-right">Expected</TableHead>
              <TableHead className="text-right">Received</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                  {search ? 'No students match your search.' : 'No students found. Add one to get started!'}
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((student) => {
                const account = student.virtual_accounts?.[0];
                const recon = student.reconciliation_log?.[0];
                const expected = recon?.amount_expected || 0;
                const received = recon?.amount_received || 0;
                const status = recon?.status || 'pending';

                return (
                  <TableRow 
                    key={student.id} 
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => router.push(`/dashboard/students/${student.id}`)}
                  >
                    <TableCell>
                      <div className="font-medium text-foreground">{student.first_name} {student.last_name}</div>
                    </TableCell>
                    <TableCell>{student.class_level || '-'}</TableCell>
                    <TableCell>
                      {account ? (
                        <span className="font-mono text-sm bg-muted px-2 py-1 rounded border border-border">
                          {account.account_number}
                        </span>
                      ) : (
                        <span className="text-muted-foreground italic text-sm">Generating...</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">{formatNaira(expected)}</TableCell>
                    <TableCell className="text-right font-medium">{formatNaira(received)}</TableCell>
                    <TableCell>
                      <PaymentStatusBadge status={status} />
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
