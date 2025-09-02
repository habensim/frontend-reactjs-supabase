import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import AuthForm from '../../components/auth/AuthForm';

export default function LoginPage() {
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot-password'>('signin');
  const [searchParams] = useSearchParams();
  const next = searchParams.get('next') || '/dashboard';

  // Store redirect path when  the component mounts

  useEffect(() => {
    try {
      localStorage.setItem('postAuthRedirect', next);
      console.log('Stored redirect path in login page:', next);
    } catch (e) {
      console.error('Failed to store redirect path:', e);
    }
  }, [next])

  const handleSuccess = () => {
    // The redirect will be handled by AuthContext
    console.log('Login successful, redirect will be handled by AuthContext');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Selamat Datang Kembali
          </h1>
          <p className="text-gray-600">
            Masuk ke akun BisnisBAIK Anda
          </p>
        </motion.div>

        <AuthForm
          mode={mode}
          onModeChange={setMode}
          onSuccess={handleSuccess}
        />
      </div>
    </div>
  );
}
