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
        const type = params.get('type'); // This can be 'signup', 'recovery', etc.

        // Get the stored redirect path
        let redirectPath = '/dashboard'; // Default fallback

        // First try to get the stored redirect path
        try {
          const storedRedirect = localStorage.getItem('postAuthRedirect');
          if (storedRedirect) {
            redirectPath = storedRedirect;
            localStorage.removeItem('postAuthRedirect');
            console.log('Using stored redirect path:', redirectPath);
          } else {
            // If no stored redirect, check for pending checkout
            const pendingCheckout = localStorage.getItem('pendingCheckout');
            if (pendingCheckout) {
              const { templateId, optionId } = JSON.parse(pendingCheckout);
              redirectPath = `/checkout?template=${templateId}&option=${optionId}`;
              localStorage.removeItem('pendingCheckout');
              console.log('Using pending checkout:', redirectPath);
            }
          }
        } catch (e) {
          console.error('Error accessing localStorage:', e);
        }

        // Also check for 'next' parameter in URL
        const nextParam = params.get('next');
        if (nextParam) {
          redirectPath = nextParam;
          console.log('Using next parameter:', redirectPath);
        }

        if (code) {
          // Exchange the code for a session (PKCE flow)
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) {
            setError(exchangeError.message);
            return;
          }

          // If this is an email verification, we might need to update the user's profile
          if (type === 'signup') {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
              // Mark the user as verified
              await supabase
                  .from('users')
                  .update({ is_verified: true })
                  .eq('id', user.id);
            }
          }
        } else {
          // Fallback: ensure session is loaded
          await supabase.auth.getSession();
        }

        console.log('Redirecting to:', redirectPath);
        navigate(redirectPath, { replace: true });
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