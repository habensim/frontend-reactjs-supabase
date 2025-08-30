import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useForm } from '../../hooks/useForm';
import FormField from '../FormField';
import AccessibleButton from '../AccessibleButton';

interface AuthFormProps {
  mode: 'signin' | 'signup' | 'forgot-password';
  onModeChange: (mode: 'signin' | 'signup' | 'forgot-password') => void;
  onSuccess?: () => void;
}

export default function AuthForm({ mode, onModeChange, onSuccess }: AuthFormProps) {
  const { signIn, signUp, signInWithGoogle, signInWithFacebook, resetPassword } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const validationRules = {
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      custom: (value: string) => {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return 'Format email tidak valid';
        }
        return null;
      }
    },
    password: {
      required: true,
      minLength: mode === 'signup' ? 8 : 1
    },
    fullName: {
      required: mode === 'signup',
      minLength: mode === 'signup' ? 2 : 0
    },
    phone: {
      required: mode === 'signup',
      minLength: mode === 'signup' ? 10 : 0
    }
  };

  const { values, errors, touched, handleChange, handleBlur, validateForm, resetForm } = useForm(
    {
      email: '',
      password: '',
      fullName: '',
      phone: ''
    },
    validationRules
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      let result;

      switch (mode) {
        case 'signup':
          result = await signUp(values.email, values.password, values.fullName, values.phone);
          if (!result.error) {
            setMessage({ type: 'success', text: 'Pendaftaran berhasil! Silakan cek email Anda untuk verifikasi.' });
            resetForm();
            setTimeout(() => onModeChange('signin'), 3000);
          } else {
            setMessage({ type: 'error', text: result.error.message || 'Gagal mendaftar' });
          }
          break;

        case 'signin':
          result = await signIn(values.email, values.password);
          if (!result.error) {
            setMessage({ type: 'success', text: 'Login berhasil!' });
            onSuccess?.();
          } else {
            setMessage({ type: 'error', text: result.error.message || 'Gagal login' });
          }
          break;

        case 'forgot-password':
          result = await resetPassword(values.email);
          if (!result.error) {
            setMessage({ type: 'success', text: 'Link reset password telah dikirim ke email Anda.' });
            resetForm();
            setTimeout(() => onModeChange('signin'), 3000);
          } else {
            setMessage({ type: 'error', text: result.error.message || 'Gagal mengirim reset password' });
          }
          break;
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Terjadi kesalahan yang tidak terduga' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialAuth = async (provider: 'google' | 'facebook') => {
    setIsLoading(true);
    setMessage(null);

    try {
      const result = provider === 'google'
        ? await signInWithGoogle()
        : await signInWithFacebook();

      if (result.error) {
        setMessage({ type: 'error', text: result.error.message || `Gagal login dengan ${provider}` });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Terjadi kesalahan yang tidak terduga' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-xl p-8"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {mode === 'signin' && 'Masuk ke Akun'}
            {mode === 'signup' && 'Buat Akun Baru'}
            {mode === 'forgot-password' && 'Reset Password'}
          </h2>
          <p className="text-gray-600">
            {mode === 'signin' && 'Selamat datang kembali di BisnisBAIK'}
            {mode === 'signup' && 'Bergabunglah dengan ribuan bisnis yang sudah percaya pada kami'}
            {mode === 'forgot-password' && 'Masukkan email Anda untuk reset password'}
          </p>
        </div>

        {/* Social Login Buttons */}
        {mode === 'signin' && (
          <div className="space-y-3 mb-6">
            <AccessibleButton
              variant="outline"
              size="lg"
              className="w-full"
              onClick={() => handleSocialAuth('google')}
              disabled={isLoading}
              ariaLabel="Login dengan Google"
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Lanjutkan dengan Google
            </AccessibleButton>

            <AccessibleButton
              variant="outline"
              size="lg"
              className="w-full"
              onClick={() => handleSocialAuth('facebook')}
              disabled={isLoading}
              ariaLabel="Login dengan Facebook"
            >
              <svg className="w-5 h-5 mr-3" fill="#1877F2" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Lanjutkan dengan Facebook
            </AccessibleButton>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">atau</span>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {mode === 'signup' && (
            <FormField
              label="Nama Lengkap"
              name="fullName"
              type="text"
              placeholder="Masukkan nama lengkap Anda"
              value={values.fullName}
              onChange={(name, value) => handleChange(name as any, value)}
              onBlur={(name) => handleBlur(name as any)}
              error={errors.fullName}
              touched={touched.fullName}
              required
            />
          )}

          {mode === 'signup' && (
            <FormField
              label="No. WhatsApp"
              name="phone"
              type="tel"
              placeholder="08123456789"
              value={values.phone}
              onChange={(name, value) => handleChange(name as any, value)}
              onBlur={(name) => handleBlur(name as any)}
              error={errors.phone}
              touched={touched.phone}
              required
            />
          )}

          <FormField
            label="Email"
            name="email"
            type="email"
            placeholder="Masukkan email Anda"
            value={values.email}
            onChange={(name, value) => handleChange(name as any, value)}
            onBlur={(name) => handleBlur(name as any)}
            error={errors.email}
            touched={touched.email}
            required
          />

          {mode !== 'forgot-password' && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Password
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={values.password}
                  onChange={(e) => handleChange('password' as any, e.target.value)}
                  onBlur={() => handleBlur('password' as any)}
                  placeholder="Masukkan password Anda"
                  className={`w-full px-4 py-3 pr-12 border rounded-lg transition-colors duration-200
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    ${touched.password && errors.password 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 hover:border-gray-400'
                    }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                >
                  {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                </button>
              </div>
              {touched.password && errors.password && (
                <p className="text-red-600 text-sm flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.password}
                </p>
              )}
            </div>
          )}

          {/* Message Display */}
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-lg ${
                message.type === 'success' 
                  ? 'bg-green-50 text-green-800 border border-green-200' 
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              {message.text}
            </motion.div>
          )}

          {/* Submit Button */}
          <AccessibleButton
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            loading={isLoading}
            disabled={isLoading}
            ariaLabel={
              mode === 'signin' ? 'Login ke akun' :
              mode === 'signup' ? 'Buat akun baru' :
              'Kirim reset password'
            }
          >
            {isLoading ? 'Memproses...' : (
              mode === 'signin' ? 'Masuk' :
              mode === 'signup' ? 'Daftar' :
              'Kirim Reset Password'
            )}
          </AccessibleButton>
        </form>

        {/* Footer Links */}
        <div className="mt-6 text-center space-y-2">
          {mode === 'signin' && (
            <>
              <button
                onClick={() => onModeChange('forgot-password')}
                className="text-sm text-blue-600 hover:text-blue-500 transition-colors"
              >
                Lupa password?
              </button>
              <div className="text-sm text-gray-600">
                Belum punya akun?{' '}
                <button
                  onClick={() => onModeChange('signup')}
                  className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  Daftar di sini
                </button>
              </div>
            </>
          )}

          {mode === 'signup' && (
            <div className="text-sm text-gray-600">
              Sudah punya akun?{' '}
              <button
                onClick={() => onModeChange('signin')}
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                Login di sini
              </button>
            </div>
          )}

          {mode === 'forgot-password' && (
            <div className="text-sm text-gray-600">
              Ingat password?{' '}
              <button
                onClick={() => onModeChange('signin')}
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                Login di sini
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
