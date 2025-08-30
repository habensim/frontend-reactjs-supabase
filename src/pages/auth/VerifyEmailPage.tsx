import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { MailCheck, ArrowLeft } from 'lucide-react';

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';
  const domain = email.split('@')[1] || '';

  const webmailUrl = (() => {
    const d = domain.toLowerCase();
    if (d.includes('gmail.com')) return 'https://mail.google.com/';
    if (d.includes('yahoo.')) return 'https://mail.yahoo.com/';
    if (d.includes('outlook.') || d.includes('hotmail.') || d.includes('live.')) return 'https://outlook.live.com/mail/';
    return `mailto:${email}`;
  })();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
            <MailCheck className="h-6 w-6 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Verifikasi Email Anda</h1>
          <p className="text-gray-600 mb-6">
            Kami telah mengirim link verifikasi ke {email || 'email Anda'}. Silakan buka email dan klik link untuk mengaktifkan akun.
          </p>

          <div className="space-y-3">
            <a href={webmailUrl} target="_blank" rel="noreferrer" className="block w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors">
              Buka Email Saya
            </a>
            <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-700">
              <ArrowLeft className="h-4 w-4 mr-1" /> Kembali ke Beranda
            </Link>
          </div>

          <div className="text-left mt-8 text-sm text-gray-600 space-y-2">
            <p>Tidak menerima email?</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Periksa folder Spam/Promosi</li>
              <li>Pastikan alamat email sudah benar</li>
              <li>Tunggu 1-2 menit, kadang ada jeda pengiriman</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
