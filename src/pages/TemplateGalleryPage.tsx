import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowRight, Eye, Star, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import { industries } from '../data/industries';

export default function TemplateGalleryPage() {
  const { industryId } = useParams<{ industryId: string }>();
  const [selectedFilter, setSelectedFilter] = useState<string>('semua');
  
  const industry = industries.find(ind => ind.id === industryId);
  
  if (!industry) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Industri Tidak Ditemukan</h1>
          <Link to="/pilih-industri" className="text-blue-600 hover:text-blue-700">
            Kembali ke Pilihan Industri
          </Link>
        </div>
      </div>
    );
  }

  const categories = ['semua', ...new Set(industry.templates.map(t => t.category))];
  const filteredTemplates = selectedFilter === 'semua' 
    ? industry.templates 
    : industry.templates.filter(t => t.category === selectedFilter);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <div className="text-6xl mb-4">{industry.icon}</div>
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Template {industry.name}
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Pilih template yang paling sesuai dengan gaya bisnis Anda. 
            Semua template sudah responsive dan siap pakai.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex items-center justify-center mb-8"
        >
          <div className="bg-white rounded-xl shadow-sm p-2 flex flex-wrap gap-2">
            <Filter className="h-5 w-5 text-gray-400 m-2" />
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedFilter(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedFilter === category
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {category === 'semua' ? 'Semua' : category}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {filteredTemplates.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group"
            >
              {/* Template Preview */}
              <div className="aspect-video overflow-hidden relative">
                <img
                  src={template.thumbnail}
                  alt={template.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button className="bg-white text-gray-900 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center space-x-2">
                      <Eye className="h-4 w-4" />
                      <span>Preview</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Template Info */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold text-gray-900">{template.name}</h3>
                  <div className="flex items-center text-sm text-gray-500">
                    <Star className="h-4 w-4 text-yellow-400 mr-1" />
                    <span>4.8</span>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-2 mb-4">
                  {template.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center text-sm text-gray-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  <Link
                    to={template.demoUrl}
                    className="block text-center border border-blue-600 text-blue-600 py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    Lihat Demo
                  </Link>
                  <Link
                    to={`/template-options/${industryId}?template=${template.id}`}
                    className="block text-center bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                  >
                    <span>Pilih Template</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>

                {/* Category Badge */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <span className="inline-block bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                    {template.category}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredTemplates.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Tidak Ada Template untuk Filter Ini
            </h3>
            <p className="text-gray-600 mb-4">
              Coba pilih filter yang berbeda atau lihat semua template
            </p>
            <button
              onClick={() => setSelectedFilter('semua')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Lihat Semua Template
            </button>
          </motion.div>
        )}

        {/* Help Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl shadow-lg p-8 text-center"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Butuh Template Khusus?
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Tim desainer kami dapat membuat template custom sesuai dengan 
            kebutuhan spesifik bisnis Anda.
          </p>
          <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            <Link
              to="/custom-design"
              className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Request Custom Design
            </Link>
            <Link
              to="/kontak"
              className="inline-flex items-center border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-600 hover:text-white transition-colors"
            >
              Hubungi Sales
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}