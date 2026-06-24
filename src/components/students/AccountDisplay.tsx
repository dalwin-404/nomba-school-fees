import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface AccountDisplayProps {
  account: {
    account_number: string;
    bank_name: string;
    account_name: string;
    status: string;
  };
}

export function AccountDisplay({ account }: AccountDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(account.account_number);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isPending = account.status === 'pending';

  return (
    <Card className={`p-6 relative overflow-hidden ${isPending ? 'border-warning/50 bg-warning/5' : 'bg-gradient-to-br from-card to-muted'}`}>
      {/* Decorative background elements */}
      {!isPending && (
        <>
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-primary/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-16 h-16 bg-success/10 rounded-full blur-xl"></div>
        </>
      )}

      <div className="relative z-10">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
          Assigned Virtual Account
        </h3>

        {isPending ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="w-12 h-12 rounded-full bg-warning/20 text-warning flex items-center justify-center mb-3">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-warning font-medium mb-1">Account Generation Pending</p>
            <p className="text-sm text-muted-foreground">The system is currently provisioning this NUBAN.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-4xl sm:text-5xl font-mono font-bold text-foreground tracking-widest">
                  {account.account_number}
                </p>
                <p className="text-lg font-medium text-primary mt-2">
                  {account.bank_name}
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleCopy}
                className={`transition-all ${copied ? 'bg-success/10 text-success border-success/30' : ''}`}
              >
                {copied ? '✅ Copied!' : '📋 Copy'}
              </Button>
            </div>

            <div className="pt-4 border-t border-border/50">
              <p className="text-sm text-muted-foreground mb-1">Account Name</p>
              <p className="font-medium">{account.account_name}</p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
