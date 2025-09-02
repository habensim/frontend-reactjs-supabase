// src/pages/RegistrationPage.tsx
import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff, Mail, Lock, User, Phone, CheckCircle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

export default function RegistrationPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const templateId = searchParams.get('template');
  const option = searchParams.get('option') || 'custom-dashboard';
  const redirectFromQuery =
      searchParams.get('redirect') ||
      (templateId ? `/checkout?template=${templateId}&option=${option}` : '/dashboard/website');
  const { signUp, signIn } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    namaBisnis: '',
    whatsapp: '',
    agreement: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      // Ensure no stale session remains
      await supabase.auth.signOut();

      // Save redirect for callback flow
      try {
        localStorage.setItem('postAuthRedirect', redirectFromQuery);
        console.log('Stored redirect path:', redirectFromQuery);

        // Also store pending checkout information
        if (templateId) {
          localStorage.setItem('pendingCheckout', JSON.stringify({ templateId, optionId: option }));
          console.log('Stored pending checkout:', { templateId, optionId: option });
        }
      } catch (e) {
        console.error('Failed to store redirect:', e);
      }

      // First, try to sign up the user
      const { data, error: signupError } = await signUp(
          formData.email,
          formData.password,
          formData.namaBisnis,
          formData.whatsapp
      );

      if (signupError) {
        // If user already exists, try to sign in instead
        if (signupError.message.includes('already registered') ||
            signupError.message.includes('already in use')) {
          const { error: signInError } = await signIn(formData.email, formData.password);

          if (signInError) {
            setErrorMessage(signInError.message);
            setIsLoading(false);
            return;
          }

          // If sign in is successful, the redirect will be handled by AuthContext
          return;
        } else {
          setErrorMessage(signupError.message);
        }
        setIsLoading(false);
        return;
      }

      // Check if user was created and session exists (email confirmation disabled)
      if (data?.user && data?.session) {
        // Session exists, redirect will be handled by AuthContext
        return;
      } else if (data?.user && !data.session) {
        // Email confirmation required
        setSuccessMessage('Pendaftaran berhasil! Silakan periksa email Anda untuk verifikasi akun.');
        setIsLoading(false);
        return;
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Terjadi kesalahan, coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const socialLogin = (provider: string) => {
    // Store redirect for OAuth providers
    try {
      localStorage.setItem('postAuthRedirect', redirectFromQuery);
      console.log('Stored redirect path for OAuth:', redirectFromQuery);
    } catch (e) {
      console.error('Failed to store redirect for OAuth:', e);
    }
    navigate('/masuk');
  };

  return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-white rounded-2xl shadow-xl p-8"
          >
            <div className="text-center mb-8">
              <div className="bg-blue-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Daftar Sekarang
              </h1>
              <p className="text-gray-600">
                Mulai buat website bisnis Anda dalam beberapa menit
              </p>
            </div>

            {errorMessage && (
                <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 border border-red-200 flex items-start">
                  <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                  <span>{errorMessage}</span>
                </div>
            )}

            {successMessage && (
                <div className="mb-4 p-3 rounded-lg bg-green-50 text-green-700 border border-green-200 flex items-start">
                  <CheckCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                  <span>{successMessage}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="email@example.com"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Minimal 8 karakter"
                  />
                  <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Business Name Field */}
              <div>
                <label htmlFor="namaBisnis" className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Bisnis
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                      type="text"
                      id="namaBisnis"
                      name="namaBisnis"
                      required
                      value={formData.namaBisnis}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Nama bisnis Anda"
                  />
                </div>
              </div>

              {/* WhatsApp Field */}
              <div>
                <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700 mb-2">
                  No. WhatsApp
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                      type="tel"
                      id="whatsapp"
                      name="whatsapp"
                      required
                      value={formData.whatsapp}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="08123456789"
                  />
                </div>
              </div>

              {/* Agreement Checkbox */}
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                      id="agreement"
                      name="agreement"
                      type="checkbox"
                      required
                      checked={formData.agreement}
                      onChange={handleChange}
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="agreement" className="text-gray-600">
                    Saya setuju dengan{' '}
                    <a href="/terms" className="text-blue-600 hover:text-blue-700">
                      syarat & ketentuan
                    </a>{' '}
                    dan{' '}
                    <a href="/privacy" className="text-blue-600 hover:text-blue-700">
                      kebijakan privasi
                    </a>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <button
                  type="submit"
                  disabled={isLoading || !formData.agreement}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                    <>
                      <span>Daftar & Lanjutkan</span>
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Atau</span>
              </div>
            </div>

            {/* Social Login */}
            <div className="space-y-3">
              <button
                  onClick={() => socialLogin('google')}
                  className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <img
                    src="https://developers.google.com/identity/images/g-logo.png"
                    alt="Google"
                    className="w-5 h-5 mr-3"
                />
                Masuk dengan Google
              </button>
              <button
                  onClick={() => socialLogin('facebook')}
                  className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <div className="w-5 h-5 mr-3 bg-blue-600 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">f</span>
                </div>
                Masuk dengan Facebook
              </button>
            </div>

            {/* Login Link */}
            <p className="text-center text-sm text-gray-600 mt-6">
              Sudah punya akun?{' '}
              <a href="/masuk" className="text-blue-600 hover:text-blue-700 font-medium">
                Masuk di sini
              </a>
            </p>
          </motion.div>
        </div>
      </div>
  );
}