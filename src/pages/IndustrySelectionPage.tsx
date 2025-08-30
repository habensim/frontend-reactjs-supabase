import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { industries } from '../data/industries';

export default function IndustrySelectionPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-4">
            Pilih Jenis Bisnis Anda
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Setiap industri memiliki kebutuhan yang berbeda. Pilih kategori yang sesuai 
            dengan bisnis Anda untuk mendapatkan template yang paling tepat.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {industries.map((industry, index) => (
            <motion.div
              key={industry.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Link
                to={`/template/${industry.id}`}
                className="block bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden group"
              >
                <div className="p-8">
                  <div className="text-center">
                    <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                      {industry.icon}
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                      {industry.name}
                    </h2>
                    <p className="text-gray-600 mb-6">
                      {industry.description}
                    </p>
                    <div className="flex items-center justify-center text-blue-600 font-semibold group-hover:text-blue-700">
                      <span>Lihat Template</span>
                      <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
                
                {/* Preview Images */}
                <div className="grid grid-cols-2 gap-2 p-4 bg-gray-50">
                  {industry.templates.slice(0, 2).map((template, templateIndex) => (
                    <div key={templateIndex} className="aspect-video rounded-lg overflow-hidden">
                      <img
                        src={template.thumbnail}
                        alt={template.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>

                <div className="p-4 bg-blue-600 text-white text-center">
                  <div className="flex items-center justify-center font-medium">
                    <span>{industry.templates.length} Template Tersedia</span>
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Help Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 text-center bg-white rounded-2xl shadow-lg p-8"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Tidak Yakin Mana Yang Cocok?
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Tim ahli kami siap membantu Anda memilih template yang paling sesuai 
            dengan kebutuhan bisnis Anda.
          </p>
          <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            <Link
              to="/konsultasi"
              className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Konsultasi Gratis
            </Link>
            <Link
              to="/bantuan"
              className="inline-flex items-center border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-600 hover:text-white transition-colors"
            >
              Lihat Panduan
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}