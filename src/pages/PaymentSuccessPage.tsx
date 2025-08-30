import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, Download, ExternalLink, Settings, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { templateOptions } from '../data/templateOptions';
import { industries } from '../data/industries';

export default function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const templateId = searchParams.get('template');
  const optionId = searchParams.get('option');
  const [downloadReady, setDownloadReady] = useState(false);

  const option = templateOptions.find(opt => opt.id === optionId);
  const template = industries
    .flatMap(ind => ind.templates)
    .find(t => t.id === templateId);

  useEffect(() => {
    // Simulate file preparation for HTML export
    if (option?.id === 'html-export') {
      const timer = setTimeout(() => {
        setDownloadReady(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [option]);

  if (!option || !template) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Halaman Tidak Ditemukan</h1>
          <Link to="/" className="text-blue-600 hover:text-blue-700">
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  const handleDownload = () => {
    // Simulate file download
    const link = document.createElement('a');
    link.href = '#'; // In real app, this would be the actual file URL
    link.download = `${template.name.toLowerCase().replace(/\s+/g, '-')}-template.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getNextSteps = () => {
    switch (option.id) {
      case 'html-export':
        return [
          {
            title: 'Download File Template',
            description: 'Download file HTML, CSS, dan JS lengkap',
            action: downloadReady ? 'Download Sekarang' : 'Mempersiapkan file...',
            actionType: 'download',
            ready: downloadReady
          },
          {
            title: 'Upload ke Hosting',
            description: 'Upload file ke hosting pilihan Anda',
            action: 'Panduan Upload',
            actionType: 'guide',
            ready: true
          },
          {
            title: 'Kustomisasi Website',
            description: 'Edit file sesuai kebutuhan bisnis Anda',
            action: 'Lihat Dokumentasi',
            actionType: 'docs',
            ready: true
          }
        ];
      case 'wordpress':
        return [
          {
            title: 'Setup WordPress',
            description: 'Instalasi WordPress dan template otomatis',
            action: 'Akses Dashboard',
            actionType: 'dashboard',
            ready: true
          },
          {
            title: 'Kustomisasi Konten',
            description: 'Edit konten menggunakan WordPress editor',
            action: 'Mulai Edit',
            actionType: 'edit',
            ready: true
          },
          {
            title: 'Install Plugin',
            description: 'Tambahkan fitur dengan plugin WordPress',
            action: 'Lihat Plugin',
            actionType: 'plugins',
            ready: true
          }
        ];
      default:
        return [
          {
            title: 'Setup Bisnis Info',
            description: 'Lengkapi informasi bisnis Anda',
            action: 'Mulai Setup',
            actionType: 'setup',
            ready: true
          },
          {
            title: 'Kustomisasi Desain',
            description: 'Sesuaikan warna, logo, dan konten',
            action: 'Buka Editor',
            actionType: 'editor',
            ready: true
          },
          {
            title: 'Publish Website',
            description: 'Website langsung online dan bisa diakses',
            action: 'Publish Sekarang',
            actionType: 'publish',
            ready: true
          }
        ];
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            🎉 Pembayaran Berhasil!
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Terima kasih! Template <strong>{template.name}</strong> dengan {option.name} 
            sudah siap untuk Anda gunakan.
          </p>
        </motion.div>

        {/* Order Details */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4">Detail Pesanan</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <img
                src={template.thumbnail}
                alt={template.name}
                className="w-full h-40 object-cover rounded-lg mb-4"
              />
            </div>
            <div className="space-y-3">
              <div>
                <span className="text-gray-600">Template:</span>
                <span className="font-semibold ml-2">{template.name}</span>
              </div>
              <div>
                <span className="text-gray-600">Platform:</span>
                <span className="font-semibold ml-2">{option.name}</span>
              </div>
              <div>
                <span className="text-gray-600">Status:</span>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium ml-2">
                  Aktif
                </span>
              </div>
              <div>
                <span className="text-gray-600">Order ID:</span>
                <span className="font-mono text-sm ml-2">#ORD-{Date.now()}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6">Langkah Selanjutnya</h2>
          <div className="space-y-4">
            {getNextSteps().map((step, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-4 ${
                    step.ready ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{step.title}</h3>
                    <p className="text-sm text-gray-600">{step.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (step.actionType === 'download' && downloadReady) {
                      handleDownload();
                    } else if (step.actionType === 'setup') {
                      window.location.href = '/setup/bisnis-info';
                    }
                    // Add other action handlers as needed
                  }}
                  disabled={!step.ready}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center ${
                    step.ready
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {step.actionType === 'download' && !step.ready && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500 mr-2"></div>
                  )}
                  {step.actionType === 'download' && step.ready && (
                    <Download className="h-4 w-4 mr-2" />
                  )}
                  {step.actionType === 'dashboard' && (
                    <Settings className="h-4 w-4 mr-2" />
                  )}
                  {step.actionType === 'guide' && (
                    <ExternalLink className="h-4 w-4 mr-2" />
                  )}
                  <span>{step.action}</span>
                </button>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Support Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="bg-blue-50 rounded-2xl p-6 text-center"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Butuh Bantuan?
          </h3>
          <p className="text-gray-600 mb-6">
            Tim support kami siap membantu Anda 24/7 untuk memastikan website Anda berjalan dengan sempurna.
          </p>
          <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            <Link
              to="/bantuan"
              className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Pusat Bantuan
            </Link>
            <Link
              to="/kontak"
              className="inline-flex items-center border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-600 hover:text-white transition-colors"
            >
              Hubungi Support
            </Link>
          </div>
        </motion.div>

        {/* Continue Button */}
        {option.id !== 'html-export' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-center mt-8"
          >
            <Link
              to={option.id === 'wordpress' ? '/wp-admin' : '/setup/bisnis-info'}
              className="inline-flex items-center bg-green-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-green-700 transform hover:scale-105 transition-all duration-300"
            >
              <span>
                {option.id === 'wordpress' ? 'Buka WordPress Dashboard' : 'Mulai Setup Website'}
              </span>
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}