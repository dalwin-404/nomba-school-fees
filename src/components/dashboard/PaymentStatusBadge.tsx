import { Badge } from '@/components/ui/Badge';

export function PaymentStatusBadge({ status }: { status: string }) {
  switch (status?.toLowerCase()) {
    case 'complete':
      return <Badge variant="success" dot>Complete</Badge>;
    case 'underpaid':
      return <Badge variant="warning" dot>Underpaid</Badge>;
    case 'overpaid':
      return <Badge variant="info" dot>Overpaid</Badge>;
    case 'pending':
    default:
      return <Badge variant="pending" dot>Pending</Badge>;
  }
}
