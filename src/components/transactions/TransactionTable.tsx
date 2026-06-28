import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { formatNaira } from '@/lib/constants';
import Link from 'next/link';
import { FileText } from 'lucide-react';

interface TransactionTableProps {
  transactions: any[];
  loading: boolean;
  emptyMessage?: string;
  hideStudentColumn?: boolean;
}

export function TransactionTable({ transactions, loading, emptyMessage = "No transactions found.", hideStudentColumn = false }: TransactionTableProps) {
  if (loading) {
    return <div className="h-64 rounded-xl skeleton w-full"></div>;
  }

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleString('en-NG', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed': return <Badge variant="success">Confirmed</Badge>;
      case 'pending': return <Badge variant="pending">Pending</Badge>;
      case 'failed': return <Badge variant="danger">Failed</Badge>;
      case 'reversed': return <Badge variant="warning">Reversed</Badge>;
      default: return <Badge variant="pending">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      {/* Desktop/Tablet Table View */}
      <div className="hidden md:block bg-card border border-border rounded-xl overflow-hidden shadow-sm">
        <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date & Time</TableHead>
            <TableHead>{hideStudentColumn ? 'Ref' : 'Student / Ref'}</TableHead>
            <TableHead>Sender</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right w-12"><span className="sr-only">Action</span></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            transactions.map((txn) => (
              <TableRow key={txn.id} className="hover:bg-muted/30">
                <TableCell className="text-sm text-muted-foreground">
                  {formatDate(txn.received_at)}
                </TableCell>
                <TableCell>
                  {txn.students && !hideStudentColumn && (
                    <div className="font-medium text-foreground mb-1 whitespace-nowrap">
                      {txn.students.first_name} {txn.students.last_name}
                    </div>
                  )}
                  <div 
                    className="font-mono text-xs text-muted-foreground bg-muted inline-block px-1.5 py-0.5 rounded max-w-[80px] sm:max-w-[120px] truncate align-bottom"
                    title={txn.nomba_txn_ref}
                  >
                    {txn.nomba_txn_ref}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">{txn.sender_name || 'Unknown'}</div>
                  <div className="text-xs text-muted-foreground capitalize">{txn.payment_method || 'transfer'}</div>
                </TableCell>
                <TableCell className="text-right font-medium text-foreground">
                  {formatNaira(txn.amount)}
                </TableCell>
                <TableCell>
                  {getStatusBadge(txn.status)}
                </TableCell>
                <TableCell className="text-right">
                  {txn.status === 'confirmed' || txn.status === 'SUCCESSFUL' ? (
                    <Link 
                      href={`/dashboard/transactions/${txn.id}/receipt`}
                      target="_blank"
                      className="inline-flex items-center justify-center p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                      title="Print Receipt"
                    >
                      <FileText size={18} />
                    </Link>
                  ) : (
                    <span className="text-muted-foreground/30"><FileText size={18} /></span>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="block md:hidden space-y-4">
        {transactions.length === 0 ? (
          <div className="bg-card border border-border rounded-xl p-8 text-center text-muted-foreground">
            {emptyMessage}
          </div>
        ) : (
          transactions.map((txn) => (
            <div key={txn.id} className="bg-card border border-border rounded-xl p-4 shadow-sm space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  {!hideStudentColumn && (
                    <div className="font-medium text-foreground">
                      {txn.students ? `${txn.students.first_name} ${txn.students.last_name}` : 'Unknown Student'}
                    </div>
                  )}
                  <div className="font-mono text-xs text-muted-foreground mt-0.5 max-w-[200px] truncate">
                    {txn.nomba_txn_ref}
                  </div>
                </div>
                {getStatusBadge(txn.status)}
              </div>
              
              <div className="flex justify-between items-center text-sm border-t border-border pt-3">
                <div className="text-muted-foreground">
                  <div>{formatDate(txn.received_at)}</div>
                  <div className="text-xs mt-0.5">{txn.sender_name || 'Unknown'} • <span className="capitalize">{txn.payment_method || 'transfer'}</span></div>
                </div>
                <div className="text-right flex flex-col items-end">
                  <div className="font-bold text-foreground mb-1">{formatNaira(txn.amount)}</div>
                  {txn.status === 'confirmed' || txn.status === 'SUCCESSFUL' ? (
                    <Link 
                      href={`/dashboard/transactions/${txn.id}/receipt`}
                      target="_blank"
                      className="text-primary text-xs hover:underline flex items-center gap-1"
                    >
                      <FileText size={14} /> Receipt
                    </Link>
                  ) : null}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
