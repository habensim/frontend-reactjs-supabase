import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

interface TransactionRow {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  payment_method: string;
  description: string;
  created_at: string;
  template_id?: string | null;
}

export default function BillingPage() {
  const { userProfile } = useAuth();
  const [transactions, setTransactions] = useState<TransactionRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        if (!userProfile) return;
        const { data, error } = await supabase
          .from('transactions')
          .select('*')
          .eq('user_id', userProfile.id)
          .order('created_at', { ascending: false });
        if (!error) setTransactions((data as TransactionRow[]) || []);
      } finally {
        setLoading(false);
      }
    })();
  }, [userProfile]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Billing</h1>
          <p className="text-gray-600">Kelola pembayaran dan riwayat transaksi Anda.</p>
        </div>

        {loading ? (
          <div className="text-gray-600">Memuat transaksi...</div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deskripsi</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Metode</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3" />
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">Belum ada transaksi</td>
                  </tr>
                )}
                {transactions.map((t) => (
                  <tr key={t.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(t.created_at).toLocaleString('id-ID')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{t.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{t.payment_method}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{t.currency || 'IDR'} {Number(t.amount).toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        t.status === 'completed' ? 'bg-green-100 text-green-700' :
                        t.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>{t.status}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      {t.status === 'pending' && (
                        <button className="px-3 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-700">Bayar</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
