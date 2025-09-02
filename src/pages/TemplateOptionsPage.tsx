import React, { useState } from 'react';
import { useParams, useSearchParams, Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Check, Star, Info, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { industries } from '../data/industries';
import { templateOptions } from '../data/templateOptions';

export default function TemplateOptionsPage() {
  const { industryId } = useParams<{ industryId: string }>();
  const [searchParams] = useSearchParams();
  const templateId = searchParams.get('template');
  const [selectedOption, setSelectedOption] = useState<string>('custom-dashboard');
  const navigate = useNavigate();

  const industry = industries.find(ind => ind.id === industryId);
  const template = industry?.templates.find(t => t.id === templateId);

  if (!industry || !template) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Template Tidak Ditemukan</h1>
          <Link to="/pilih-industri" className="text-blue-600 hover:text-blue-700">
            Kembali ke Pilihan Industri
          </Link>
        </div>
      </div>
    );
  }

  const handleContinue = () => {
    const option = templateOptions.find(opt => opt.id === selectedOption);
    if (option?.id === 'html-export') {
      // Redirect to checkout for HTML export
      navigate(`/checkout?template=${templateId}&option=${selectedOption}`);
    } else {
      // Continue to registration
      navigate(`/daftar?template=${templateId}&option=${selectedOption}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <Link
            to={`/template/${industryId}`}
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Template
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Pilih Cara Mengelola Website Anda
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-6">
            Template <strong>{template.name}</strong> siap digunakan.
            Pilih platform yang paling sesuai dengan kebutuhan dan kemampuan teknis Anda.
          </p>

          {/* Selected Template Preview */}
          <div className="bg-white rounded-xl shadow-lg p-4 max-w-md mx-auto">
            <img
              src={template.thumbnail}
              alt={template.name}
              className="w-full h-32 object-cover rounded-lg mb-3"
            />
            <h3 className="font-semibold text-gray-900">{template.name}</h3>
            <p className="text-sm text-gray-600">{industry.name}</p>
          </div>
        </motion.div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {templateOptions.map((option, index) => (
            <motion.div
              key={option.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer ${
                selectedOption === option.id 
                  ? 'ring-2 ring-blue-500 transform scale-105' 
                  : 'hover:scale-102'
              }`}
              onClick={() => setSelectedOption(option.id)}
            >
              {/* Recommended Badge */}
              {option.recommended && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="bg-yellow-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center">
                    <Star className="h-3 w-3 mr-1" />
                    Direkomendasikan
                  </div>
                </div>
              )}

              <div className="p-6">
                {/* Header */}
                <div className="text-center mb-6">
                  <div className="text-4xl mb-3">{option.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {option.name}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {option.description}
                  </p>
                </div>

                {/* Price */}
                <div className="text-center mb-6">
                  <div className="text-2xl font-bold text-blue-600">
                    {option.price}
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-3 mb-6">
                  {option.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start">
                      <Check className="h-4 w-4 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Selection Indicator */}
                <div className="text-center">
                  <div className={`w-6 h-6 rounded-full border-2 mx-auto transition-all ${
                    selectedOption === option.id
                      ? 'bg-blue-600 border-blue-600'
                      : 'border-gray-300'
                  }`}>
                    {selectedOption === option.id && (
                      <Check className="h-4 w-4 text-white m-0.5" />
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Comparison Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-blue-50 rounded-xl p-6 mb-8"
        >
          <div className="flex items-start">
            <Info className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Bantuan Memilih:</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-700">
                <div>
                  <strong>Dashboard BisnisBAIK:</strong> Terbaik untuk pemula yang ingin kemudahan maksimal dengan fitur khusus bisnis Indonesia.
                </div>
                <div>
                  <strong>WordPress:</strong> Ideal untuk yang sudah familiar dengan WordPress dan butuh fleksibilitas tinggi.
                </div>
                <div>
                  <strong>Export HTML:</strong> Cocok untuk developer atau yang ingin hosting sendiri dengan kontrol penuh.
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Continue Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-center"
        >
          <button
            onClick={handleContinue}
            className="bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-700 transform hover:scale-105 transition-all duration-300 inline-flex items-center"
          >
            <span>
              {selectedOption === 'html-export' ? 'Beli & Download' : 'Lanjutkan'}
            </span>
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>

          <p className="text-sm text-gray-600 mt-4">
            {selectedOption === 'html-export'
              ? 'File HTML akan tersedia untuk download setelah pembayaran'
              : 'Langkah selanjutnya: Daftar akun dan setup bisnis info'
            }
          </p>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-16 bg-white rounded-2xl shadow-lg p-8"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Pertanyaan Umum
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Bisakah saya pindah platform nanti?
              </h4>
              <p className="text-gray-600 text-sm">
                Ya, Anda bisa upgrade dari Dashboard BisnisBAIK ke WordPress atau export HTML kapan saja.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Apakah ada trial period?
              </h4>
              <p className="text-gray-600 text-sm">
                Dashboard BisnisBAIK gratis selamanya untuk subdomain. WordPress dan HTML export bisa dicoba 7 hari.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Bagaimana dengan support?
              </h4>
              <p className="text-gray-600 text-sm">
                Semua paket mendapat support email. Paket berbayar mendapat support prioritas dan WhatsApp.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Apakah template bisa dikustomisasi?
              </h4>
              <p className="text-gray-600 text-sm">
                Ya, semua template fully customizable. Level customization tergantung platform yang dipilih.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}