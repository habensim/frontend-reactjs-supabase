import React, { useEffect, useMemo, useState } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

interface ProjectRow {
  id: string;
  user_id: string;
  name: string;
  description: string;
  template_id?: string | null;
  customizations: Record<string, any>;
  status: 'draft' | 'published' | 'archived';
  published_url?: string | null;
}

interface TransactionRow { id: string; status: 'pending' | 'completed' | 'failed' | 'refunded'; template_id?: string | null; }

export default function WebsitePage() {
  const { userProfile } = useAuth();
  const [project, setProject] = useState<ProjectRow | null>(null);
  const [transactions, setTransactions] = useState<TransactionRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        if (!userProfile) return;
        const [{ data: proj }, { data: tx }] = await Promise.all([
          supabase
            .from('user_projects')
            .select('*')
            .eq('user_id', userProfile.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle(),
          supabase
            .from('transactions')
            .select('id,status,template_id')
            .eq('user_id', userProfile.id)
        ]);
        setProject((proj as ProjectRow) || null);
        setTransactions((tx as TransactionRow[]) || []);
      } finally {
        setLoading(false);
      }
    })();
  }, [userProfile]);

  const isPaid = useMemo(() => {
    if (!project) return false;
    return transactions.some(t => t.status === 'completed' && t.template_id === project.template_id);
  }, [project, transactions]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Website</h1>
          <p className="text-gray-600">Kelola website yang Anda pilih.</p>
        </div>

        {loading && <div className="text-gray-600">Memuat data...</div>}

        {!loading && !project && (
          <div className="p-4 rounded-lg bg-gray-50 border border-gray-200 text-gray-700">Belum ada project. Silakan pilih template terlebih dahulu.</div>
        )}

        {project && (
          <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
            <div>
              <div className="text-sm text-gray-500">Nama Project</div>
              <div className="text-lg font-semibold text-gray-900">{project.name}</div>
            </div>
            <div className="text-sm text-gray-600">Template: {project.template_id || '-'}</div>
            <div className="text-sm text-gray-600">Status: {isPaid ? 'Aktif' : 'Terkunci (Belum Dibayar)'}</div>
            <div className="pt-2">
              {isPaid ? (
                <a href={project.published_url || '#'} className="inline-flex px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">Buka Website</a>
              ) : (
                <a href="/dashboard/billing" className="inline-flex px-4 py-2 rounded bg-yellow-500 text-white hover:bg-yellow-600">Bayar untuk Aktifkan</a>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
