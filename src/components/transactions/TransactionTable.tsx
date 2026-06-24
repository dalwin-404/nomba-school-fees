import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { formatNaira } from '@/lib/constants';

interface TransactionTableProps {
  transactions: any[];
  loading: boolean;
  emptyMessage?: string;
}

export function TransactionTable({ transactions, loading, emptyMessage = "No transactions found." }: TransactionTableProps) {
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
    <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date & Time</TableHead>
            <TableHead>Student / Ref</TableHead>
            <TableHead>Sender</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            transactions.map((txn) => (
              <TableRow key={txn.id} className="hover:bg-muted/30">
                <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                  {formatDate(txn.received_at)}
                </TableCell>
                <TableCell>
                  {txn.students && (
                    <div className="font-medium text-foreground mb-1">
                      {txn.students.first_name} {txn.students.last_name}
                    </div>
                  )}
                  <div className="font-mono text-xs text-muted-foreground bg-muted inline-block px-1.5 py-0.5 rounded">
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
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
