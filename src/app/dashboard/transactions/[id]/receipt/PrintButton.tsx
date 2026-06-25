'use client';

import { Button } from '@/components/ui/Button';
import { Printer } from 'lucide-react';

export function PrintButton() {
  return (
    <Button 
      onClick={() => window.print()}
      className="inline-flex items-center justify-center gap-2"
    >
      <Printer size={16} /> Print Receipt
    </Button>
  );
}
