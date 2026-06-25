import { notFound, redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { findByAdminUserId } from '@/lib/db/schools';
import { findById } from '@/lib/db/transactions';
import { formatNaira } from '@/lib/constants';
import { Button } from '@/components/ui/Button';
import { Printer, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { PrintButton } from './PrintButton';

export default async function ReceiptPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const school = await findByAdminUserId(user.id);
  if (!school) {
    redirect('/dashboard');
  }

  const transaction = await findById(id);

  if (!transaction || transaction.school_id !== school.id) {
    notFound();
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('en-NG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="max-w-2xl mx-auto my-10 bg-white text-black p-10 rounded-2xl shadow-lg border border-slate-200 print:shadow-none print:border-none print:p-0 print:my-0">
      
      {/* Non-printable Action Bar */}
      <div className="flex justify-between items-center mb-8 pb-8 border-b border-slate-100 print:hidden">
        <Link href="/dashboard/transactions" className="text-slate-500 hover:text-slate-900 inline-flex items-center gap-2 font-medium">
          <ArrowLeft size={16} /> Back to Transactions
        </Link>
        <PrintButton />
      </div>

      {/* Receipt Content */}
      <div className="space-y-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{school.name}</h1>
            <p className="text-slate-500 mt-1">Official Payment Receipt</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-slate-500">Receipt No.</p>
            <p className="text-lg font-bold text-slate-900 font-mono">{transaction.nomba_txn_ref.slice(-8).toUpperCase()}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 border-y border-slate-100 py-6">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Received From</p>
            <p className="font-semibold text-slate-900 text-lg">{transaction.sender_name || 'N/A'}</p>
            <p className="text-slate-600 capitalize">{transaction.payment_method || 'Bank Transfer'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Student Details</p>
            <p className="font-semibold text-slate-900">{transaction.students?.first_name} {transaction.students?.last_name}</p>
            <p className="text-slate-600">Class: {transaction.students?.class_level}</p>
            <p className="text-slate-600 font-mono text-sm">Account: {transaction.virtual_accounts?.account_number}</p>
          </div>
        </div>

        <div>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-800 text-slate-900">
                <th className="py-3 font-semibold">Description</th>
                <th className="py-3 font-semibold text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-100">
                <td className="py-4 text-slate-800">
                  School Fees Payment
                  <div className="text-sm text-slate-500 mt-1">Ref: {transaction.nomba_txn_ref}</div>
                </td>
                <td className="py-4 text-right font-bold text-slate-900 text-lg">
                  {formatNaira(transaction.amount)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-end pt-8">
          <div>
            <p className="text-sm text-slate-500">Payment Date</p>
            <p className="font-medium text-slate-900">{formatDate(transaction.received_at)}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-500 mb-1">Status</p>
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-sm">
              SUCCESSFUL
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-slate-200 text-center text-sm text-slate-500">
          <p>Thank you for your payment!</p>
          <p className="mt-1">This is a computer-generated receipt and requires no physical signature.</p>
        </div>
      </div>
    </div>
  );
}
