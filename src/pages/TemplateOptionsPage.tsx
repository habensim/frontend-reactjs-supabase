import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { templateOptions } from '../data/templateOptions.ts';
import { industries } from '../data/industries.ts';

export default function TemplateOptionsPage() {
  const navigate = useNavigate();
  const { templateId } = useParams<{ templateId: string }>();
  const location = useLocation();
  const { user } = useAuth();
  const [selectedOption, setSelectedOption] = useState<string>('custom-dashboard');

  // Get the option from URL if available
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const option = params.get('option');
    if (option) {
      setSelectedOption(option);
    }
  }, [location.search]);

  // Find the selected template
  const template = industries.flatMap(ind => ind.templates).find(t => t.id === templateId);

  if (!template) {
    return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Template tidak ditemukan</h1>
            <button
                onClick={() => navigate('/pilih-industri')}
                className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Kembali ke Gallery
            </button>
          </div>
        </div>
    );
  }

  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId);

    // Store the selected template and option in localStorage
    try {
      localStorage.setItem('pendingCheckout', JSON.stringify({
        templateId,
        optionId
      }));
      console.log('Stored pending checkout:', { templateId, optionId });
    } catch (e) {
      console.error('Failed to store pending checkout:', e);
    }
  };

  const handlePurchase = () => {
    // Store the selected template and option in localStorage
    try {
      localStorage.setItem('pendingCheckout', JSON.stringify({
        templateId,
        optionId: selectedOption
      }));
      console.log('Stored pending checkout:', { templateId, optionId: selectedOption });
    } catch (e) {
      console.error('Failed to store pending checkout:', e);
    }

    // Check if user is logged in
    if (user) {
      // User is logged in, go directly to checkout
      navigate(`/checkout?template=${templateId}&option=${selectedOption}`);
    } else {
      // User not logged in, go to auth first
      navigate(`/daftar?redirect=${encodeURIComponent(`/checkout?template=${templateId}&option=${selectedOption}`)}`);
    }
  };

  return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <button
                onClick={() => navigate(`/template-details/${templateId}`)}
                className="flex items-center text-blue-600 hover:text-blue-700"
            >
              ← Kembali
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="md:flex">
              <div className="md:flex-shrink-0">
                <img
                    className="h-48 w-full object-cover md:w-48"
                    src={template.thumbnail}
                    alt={template.name}
                />
              </div>
              <div className="p-8">
                <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
                  {template.category}
                </div>
                <h1 className="mt-1 text-2xl font-bold text-gray-900">
                  {template.name}
                </h1>
                <p className="mt-2 text-gray-600">
                  {template.description}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Pilih Opsi</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {templateOptions.map((option) => (
                  <div
                      key={option.id}
                      className={`border-2 rounded-xl p-6 cursor-pointer transition-all ${
                          selectedOption === option.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleOptionSelect(option.id)}
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {option.name}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {option.description}
                    </p>
                    <div className="text-2xl font-bold text-blue-600">
                      {new Intl.NumberFormat('id-ID', {
                        style: 'currency',
                        currency: 'IDR',
                        minimumFractionDigits: 0
                      }).format(option.price)}
                    </div>
                    {option.features && (
                        <ul className="mt-4 space-y-2">
                          {option.features.map((feature, index) => (
                              <li key={index} className="flex items-start">
                                <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="text-sm text-gray-600">{feature}</span>
                              </li>
                          ))}
                        </ul>
                    )}
                  </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <button
                  onClick={handlePurchase}
                  className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                Beli Sekarang
              </button>
            </div>
          </div>
        </div>
      </div>
  );
}