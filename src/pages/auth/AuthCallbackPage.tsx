import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { PageLoader } from '../../components/LoadingSpinner';

export default function AuthCallbackPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const params = new URLSearchParams(location.search);
        const code = params.get('code');
        const next = params.get('next') || '/dashboard';

        if (code) {
          // Exchange the code for a session (PKCE flow)
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) {
            setError(exchangeError.message);
            return;
          }
        } else {
          // Fallback: ensure session is loaded
          await supabase.auth.getSession();
        }

        navigate(next, { replace: true });
      } catch (e: any) {
        setError(e?.message || 'Gagal memproses login');
      }
    })();
  }, [location.search, navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full p-6 bg-white rounded shadow">
          <p className="text-red-600 mb-3">{error}</p>
          <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={() => navigate('/')}>Kembali</button>
        </div>
      </div>
    );
  }

  return <PageLoader />;
}
