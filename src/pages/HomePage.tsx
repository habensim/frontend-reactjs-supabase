import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Star, Play, Globe, Smartphone, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HomePage() {
  const industryExamples = [
    {
      type: 'Makanan',
      examples: [
        { name: 'Warung Bu Sari', image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=300' },
        { name: 'Kafe Kopi Nusantara', image: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=300' }
      ]
    },
    {
      type: 'Fashion',
      examples: [
        { name: 'Butik Cantik', image: 'https://images.pexels.com/photos/994517/pexels-photo-994517.jpeg?auto=compress&cs=tinysrgb&w=300' },
        { name: 'Distro Streetwear', image: 'https://images.pexels.com/photos/1069155/pexels-photo-1069155.jpeg?auto=compress&cs=tinysrgb&w=300' }
      ]
    },
    {
      type: 'Jasa',
      examples: [
        { name: 'Salon Kecantikan', image: 'https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&cs=tinysrgb&w=300' },
        { name: 'Service AC', image: 'https://images.pexels.com/photos/2244746/pexels-photo-2244746.jpeg?auto=compress&cs=tinysrgb&w=300' }
      ]
    }
  ];

  const features = [
    { icon: CheckCircle, text: 'Tanpa Coding' },
    { icon: Globe, text: 'Langsung Online' },
    { icon: DollarSign, text: 'Harga Terjangkau' }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left"
            >
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight mb-6">
                Buat Website Bisnis Anda dalam{' '}
                <span className="text-yellow-400">10 Menit</span>
              </h1>
              
              <p className="text-xl lg:text-2xl mb-8 text-blue-100">
                Platform termudah untuk membuat website profesional tanpa ribet
              </p>

              <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-8">
                {features.map((feature, index) => (
                  <motion.div
                    key={feature.text}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full"
                  >
                    <feature.icon className="h-5 w-5 text-yellow-400" />
                    <span className="font-medium">{feature.text}</span>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <Link
                  to="/pilih-industri"
                  className="inline-flex items-center bg-yellow-500 text-blue-900 px-8 py-4 rounded-xl text-lg font-bold hover:bg-yellow-400 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Mulai Buat Website Gratis
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </motion.div>

              <p className="text-sm text-blue-200 mt-4">
                Mulai Gratis • Upgrade Rp 99rb/tahun
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl shadow-2xl">
                <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center mb-4">
                  <div className="text-center text-gray-700">
                    <Smartphone className="h-16 w-16 mx-auto mb-4 text-blue-600" />
                    <p className="text-lg font-semibold">Preview Website Anda</p>
                    <p className="text-sm">Lihat hasil real-time</p>
                  </div>
                </div>
                <div className="flex justify-center">
                  <button className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    <Play className="h-4 w-4 mr-2" />
                    Lihat Demo
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Industry Examples */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Template untuk Setiap Jenis Bisnis
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Pilih dari ribuan template yang disesuaikan khusus untuk industri Anda
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {industryExamples.map((industry, index) => (
              <motion.div
                key={industry.type}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <h3 className="text-2xl font-bold text-gray-900 text-center mb-6">
                  {industry.type}
                </h3>
                <div className="space-y-4">
                  {industry.examples.map((example, exampleIndex) => (
                    <div
                      key={exampleIndex}
                      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group cursor-pointer"
                    >
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={example.image}
                          alt={example.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-4">
                        <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {example.name}
                        </h4>
                        <div className="flex items-center mt-2 text-sm text-gray-600">
                          <Star className="h-4 w-4 text-yellow-400 mr-1" />
                          <span>4.8</span>
                          <span className="mx-2">•</span>
                          <span>Siap Pakai</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link
              to="/pilih-industri"
              className="inline-flex items-center bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-700 transform hover:scale-105 transition-all duration-300"
            >
              Lihat Semua Template
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Kenapa Pilih BisnisBAIK?
            </h2>
            <p className="text-xl text-gray-600">
              Solusi lengkap untuk kebutuhan website bisnis Anda
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Setup Mudah & Cepat',
                description: 'Hanya 10 menit untuk membuat website profesional',
                icon: '⚡'
              },
              {
                title: 'Desain Responsif',
                description: 'Website otomatis terlihat sempurna di semua device',
                icon: '📱'
              },
              {
                title: 'SEO Optimized',
                description: 'Website mudah ditemukan di Google',
                icon: '🔍'
              },
              {
                title: 'Hosting Gratis',
                description: 'Server cepat dan reliable tanpa biaya tambahan',
                icon: '🚀'
              },
              {
                title: 'SSL Certificate',
                description: 'Keamanan website terjamin dengan sertifikat SSL',
                icon: '🔒'
              },
              {
                title: 'Support 24/7',
                description: 'Tim support siap membantu kapan saja',
                icon: '💬'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-8 bg-gray-50 rounded-2xl hover:bg-blue-50 transition-colors duration-300 group"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              Siap Membuat Website Bisnis Anda?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Bergabunglah dengan ribuan bisnis yang sudah percaya pada BisnisBAIK
            </p>
            <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
              <Link
                to="/pilih-industri"
                className="inline-flex items-center bg-yellow-500 text-blue-900 px-8 py-4 rounded-xl text-lg font-bold hover:bg-yellow-400 transform hover:scale-105 transition-all duration-300"
              >
                Mulai Sekarang - GRATIS
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/demo"
                className="inline-flex items-center border-2 border-white text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300"
              >
                Lihat Demo
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}