import React, { useState } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

export default function ProfilePage() {
  const { userProfile } = useAuth();
  const [fullName, setFullName] = useState(userProfile?.full_name || '');
  const [phone, setPhone] = useState(userProfile?.phone || '');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const save = async () => {
    if (!userProfile) return;
    setSaving(true);
    setMessage(null);
    const { error } = await supabase
      .from('users')
      .update({ full_name: fullName, phone })
      .eq('id', userProfile.id);
    setSaving(false);
    setMessage(error ? 'Gagal menyimpan' : 'Tersimpan');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-lg">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Profil</h1>
          <p className="text-gray-600">Kelola informasi akun Anda.</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
            <input className="w-full border rounded px-3 py-2" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">No. WhatsApp</label>
            <input className="w-full border rounded px-3 py-2" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div>
            <button onClick={save} disabled={saving} className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50">
              {saving ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
          {message && <div className="text-sm text-gray-700">{message}</div>}
        </div>
      </div>
    </DashboardLayout>
  );
}
