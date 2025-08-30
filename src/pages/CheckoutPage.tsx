// src/pages/CheckoutPage.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Smartphone, Building, Store, Shield, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import { templateOptions } from '../data/templateOptions';
import { industries } from '../data/industries';

// NEW: auth + supabase
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

type VaInfo = {
  va_bank: string | null;
  va_number: string | null;
  amount: number;
  expires_at: string | null;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  transaction_id: string;
  payment_url: string;
};

export default function CheckoutPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const templateId = searchParams.get('template') || '';
  const optionId = searchParams.get('option') || '';

  // Keep your “selected method” state, but default to VA (only VA works in mock)
  const [selectedPayment, setSelectedPayment] = useState<string>('virtual-account');

  // NEW: invoice + realtime state
  const [va, setVa] = useState<VaInfo | null>(null);
  const [creatingInvoice, setCreatingInvoice] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Keep your lookups for UI (thumbnail/name); fall back gracefully if not found
  const option = useMemo(() => templateOptions.find(opt => opt.id === optionId) || null, [optionId]);
  const template = useMemo(
      () => industries.flatMap(ind => ind.templates).find(t => t.id === templateId) || null,
      [templateId]
  );

  // If user is not logged in, force login and come back here
  useEffect(() => {
    if (!user) {
      // const redirect = `/checkout?template=${encodeURIComponent(templateId)}&option=${encodeURIComponent(optionId)}`;
      navigate(`/daftar?redirect=${encodeURIComponent(`/checkout?template=${templateId}&option=${optionId}`)}`);
    }
  }, [user, navigate, templateId, optionId]);

  // Create or resume a mock VA invoice once user is present
  useEffect(() => {
    let unsubscribed = false;
    let channel: ReturnType<typeof supabase.channel> | null = null;

    const run = async () => {
      if (!user || !templateId) return;

      try {
        setErrorMsg(null);

        // If we already have an invoice in this session, just resubscribe
        if (va?.transaction_id) {
          channel = supabase
              .channel(`txn-${va.transaction_id}`)
              .on(
                  'postgres_changes',
                  { event: 'UPDATE', schema: 'public', table: 'transactions', filter: `id=eq.${va.transaction_id}` },
                  (payload: any) => {
                    const row = payload.new;
                    setVa(prev => (prev ? { ...prev, status: row.status } : prev));
                    if (row.status === 'completed') {
                      // entitlement is created by the mock gateway; go to dashboard
                      navigate('/dashboard/website'); // adjust route as needed
                    }
                  }
              )
              .subscribe();
          return;
        }

        // No invoice yet → create it
        setCreatingInvoice(true);

        // Persist choice so a refresh keeps context (optional)
        localStorage.setItem('pendingCheckout', JSON.stringify({ templateId, optionId }));

        const { data, error } = await supabase.functions.invoke('create-mock-va', {
          body: { templateId, optionId },
        });

        if (error) throw error;

        const v: VaInfo = {
          va_bank: data.va_bank,
          va_number: data.va_number,
          amount: data.amount,
          expires_at: data.expires_at,
          status: data.status,
          transaction_id: data.transaction_id,
          payment_url: data.payment_url,
        };
        if (!unsubscribed) setVa(v);

        // Subscribe to updates for this transaction
        channel = supabase
            .channel(`txn-${v.transaction_id}`)
            .on(
                'postgres_changes',
                { event: 'UPDATE', schema: 'public', table: 'transactions', filter: `id=eq.${v.transaction_id}` },
                (payload: any) => {
                  const row = payload.new;
                  setVa(prev => (prev ? { ...prev, status: row.status } : prev));
                  if (row.status === 'completed') {
                    localStorage.removeItem('pendingCheckout');
                    navigate('/dashboard/website'); // adjust route as needed
                  }
                  if (row.status === 'failed') {
                    setErrorMsg('Pembayaran gagal. Silakan coba kembali.');
                  }
                }
            )
            .subscribe();
      } catch (e: any) {
        console.error(e);
        setErrorMsg(e?.message || 'Gagal membuat Virtual Account');
      } finally {
        setCreatingInvoice(false);
      }
    };

    run();

    return () => {
      unsubscribed = true;
      if (channel) supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, templateId, optionId]);

  // ORIGINAL helper kept for UI fallback only (final price comes from invoice `va.amount`)
  const getPriceFallback = () => {
    if (!option) return 0;
    if (option.id === 'html-export') return 299000;
    if (option.id === 'wordpress') return 149000;
    return 99000;
  };

  const formatPrice = (price: number) =>
      new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);

  const paymentMethods = [
    {
      id: 'bank-transfer',
      name: 'Transfer Bank',
      icon: Building,
      options: ['BCA', 'Mandiri', 'BRI', 'BNI', 'CIMB Niaga'],
      description: 'Transfer manual ke rekening bank',
      disabled: true, // disabled in mock
    },
    {
      id: 'ewallet',
      name: 'E-Wallet',
      icon: Smartphone,
      options: ['DANA', 'OVO', 'GoPay', 'ShopeePay', 'LinkAja'],
      description: 'Pembayaran instan via e-wallet',
      disabled: true, // disabled in mock
    },
    {
      id: 'virtual-account',
      name: 'Virtual Account',
      icon: CreditCard,
      options: ['Permata VA', 'CIMB VA', 'BNI VA', 'BRI VA'],
      description: 'Bayar via ATM atau mobile banking (Mock VA aktif)',
      disabled: false,
    },
    {
      id: 'convenience-store',
      name: 'Convenience Store',
      icon: Store,
      options: ['Indomaret', 'Alfamart'],
      description: 'Bayar di minimarket terdekat',
      disabled: true, // disabled in mock
    },
  ] as const;

  // NEW: instead of “simulate timeout”, this opens the MockPay page
  const handlePayment = async () => {
    if (selectedPayment !== 'virtual-account') {
      setErrorMsg('Dalam mode mock, hanya Virtual Account yang tersedia.');
      return;
    }
    if (!va?.payment_url) {
      setErrorMsg('Invoice belum siap. Coba lagi.');
      return;
    }
    window.open(va.payment_url, '_blank', 'noopener,noreferrer');
  };

  // If template/option not found in your local arrays, we can still show invoice details
  const show404 = !template || !option;
  const effectiveTotal = va ? va.amount : getPriceFallback();

  return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="mb-6">
            <Link to={templateId ? `/template-options?template=${templateId}` : '/pilih-industri'} className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Summary */}
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Ringkasan Pesanan</h2>

                {/* Template Info */}
                <div className="border-b border-gray-200 pb-4 mb-4">
                  {template?.thumbnail ? (
                      <img src={template.thumbnail} alt={template?.name ?? 'Template'} className="w-full h-32 object-cover rounded-lg mb-3" />
                  ) : (
                      <div className="w-full h-32 bg-gray-100 rounded-lg mb-3" />
                  )}
                  <h3 className="font-semibold text-gray-900">{template?.name ?? 'Template'}</h3>
                  <p className="text-sm text-gray-600">{option?.name ?? 'Paket'}</p>
                </div>

                {/* Pricing Breakdown */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">{option?.name ?? 'Harga'}</span>
                    <span className="font-semibold">{formatPrice(effectiveTotal)}</span>
                  </div>
                  {option?.id === 'wordpress' && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Domain .com (1 tahun)</span>
                        <span className="text-green-600">Gratis</span>
                      </div>
                  )}
                  {option?.id === 'html-export' && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Source code lengkap</span>
                        <span className="text-green-600">Termasuk</span>
                      </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">SSL Certificate</span>
                    <span className="text-green-600">Gratis</span>
                  </div>
                  <hr />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-blue-600">{formatPrice(effectiveTotal)}</span>
                  </div>
                </div>

                {/* Security Badge */}
                <div className="flex items-center text-sm text-gray-600">
                  <Shield className="h-4 w-4 mr-2 text-green-500" />
                  <span>Pembayaran aman & terenkripsi</span>
                </div>
              </div>
            </motion.div>

            {/* Payment Form */}
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Metode Pembayaran</h2>

                {/* Payment Methods */}
                <div className="space-y-4 mb-8">
                  {paymentMethods.map((method) => (
                      <div
                          key={method.id}
                          role="button"
                          aria-disabled={method.disabled}
                          className={`border-2 rounded-xl p-4 transition-all ${
                              selectedPayment === method.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                          } ${method.disabled ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}`}
                          onClick={() => !method.disabled && setSelectedPayment(method.id)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <method.icon className="h-5 w-5 text-gray-600 mr-3" />
                            <span className="font-semibold text-gray-900">
                          {method.name} {method.id === 'virtual-account' && <span className="ml-2 text-xs text-green-700">(aktif untuk mock)</span>}
                        </span>
                          </div>
                          <div className={`w-4 h-4 rounded-full border-2 ${selectedPayment === method.id ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}>
                            {selectedPayment === method.id && <div className="w-2 h-2 bg-white rounded-full m-0.5" />}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{method.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {method.options.map((opt, index) => (
                              <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">
                          {opt}
                        </span>
                          ))}
                        </div>
                      </div>
                  ))}
                </div>

                {/* Customer Info Form (kept visual only) */}
                <div className="border-t border-gray-200 pt-6 mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Informasi Pembeli</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Nama lengkap Anda" />
                    <input type="email" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="email@example.com" />
                    <input type="tel" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="08123456789" />
                    <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Nama bisnis Anda" />
                  </div>
                </div>

                {/* Terms & Conditions */}
                <div className="flex items-start mb-6">
                  <input type="checkbox" id="terms" className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                  <label htmlFor="terms" className="ml-3 text-sm text-gray-600">
                    Saya setuju dengan{' '}
                    <a href="/terms" className="text-blue-600 hover:text-blue-700">syarat & ketentuan</a> dan{' '}
                    <a href="/privacy" className="text-blue-600 hover:text-blue-700">kebijakan privasi</a>
                  </label>
                </div>

                {/* Error */}
                {errorMsg && <div className="mb-4 rounded-md bg-red-50 border border-red-200 p-3 text-red-700">{errorMsg}</div>}

                {/* Payment Button */}
                <button
                    onClick={handlePayment}
                    disabled={creatingInvoice || !va || va.status === 'completed'}
                    className="w-full bg-blue-600 text-white py-4 px-6 rounded-xl text-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
                >
                  {creatingInvoice ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3" />
                  ) : (
                      <>
                        {option?.id === 'html-export' ? (
                            <>
                              <Download className="h-5 w-5 mr-2" />
                              Bayar &amp; Download (Mock VA)
                            </>
                        ) : (
                            <>
                              <CreditCard className="h-5 w-5 mr-2" />
                              Proses Pembayaran (Mock VA)
                            </>
                        )}
                      </>
                  )}
                </button>

                <p className="text-center text-sm text-gray-600 mt-4">
                  Halaman MockPay akan terbuka. Klik <em>Tandai Lunas</em> di sana. Status di halaman ini akan otomatis berubah dan Anda akan diarahkan ke dashboard.
                </p>

                {/* VA details panel */}
                {va && (
                    <div className="mt-6 rounded-lg border border-gray-200 p-4 bg-gray-50">
                      <p className="text-sm text-gray-700 mb-1">
                        Bank VA: <strong>{va.va_bank ?? '-'}</strong>
                      </p>
                      <p className="text-sm text-gray-700 mb-1">
                        No. VA: <strong className="font-mono">{va.va_number ?? '-'}</strong>
                      </p>
                      <p className="text-sm text-gray-700 mb-1">
                        Jumlah: <strong>{formatPrice(va.amount)}</strong>
                      </p>
                      <p className="text-sm text-gray-700">
                        Berlaku sampai: <strong>{va.expires_at ? new Date(va.expires_at).toLocaleString('id-ID') : '-'}</strong>
                      </p>
                      <p className="mt-2 text-sm">
                        Status:{' '}
                        <strong
                            className={
                              va.status === 'completed' ? 'text-green-600' :
                                  va.status === 'pending' ? 'text-yellow-600' : 'text-red-600'
                            }
                        >
                          {va.status}
                        </strong>
                      </p>
                    </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
  );
}
