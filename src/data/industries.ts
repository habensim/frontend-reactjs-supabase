import { Industry } from '../types';

export const industries: Industry[] = [
  {
    id: 'makanan',
    name: 'Makanan & Minuman',
    description: 'Restoran, warung, katering, kafe',
    icon: '🍽️',
    templates: [
      {
        id: 'restoran-modern',
        name: 'Restoran Modern',
        industry: 'makanan',
        thumbnail: 'https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg?auto=compress&cs=tinysrgb&w=400',
        demoUrl: '#',
        features: ['Menu Digital', 'Reservasi Online', 'Lokasi Maps'],
        category: 'Restoran'
      },
      {
        id: 'warung-tradisional',
        name: 'Warung Tradisional',
        industry: 'makanan',
        thumbnail: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
        demoUrl: '#',
        features: ['Menu Sederhana', 'WhatsApp Order', 'Jam Buka'],
        category: 'Warung'
      },
      {
        id: 'kafe-kopi',
        name: 'Kafe & Kopi',
        industry: 'makanan',
        thumbnail: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=400',
        demoUrl: '#',
        features: ['Menu Kopi', 'Suasana Foto', 'WiFi Info'],
        category: 'Kopi'
      }
    ]
  },
  {
    id: 'fashion',
    name: 'Fashion & Pakaian',
    description: 'Butik, distro, fashion online',
    icon: '👕',
    templates: [
      {
        id: 'butik-modern',
        name: 'Butik Modern',
        industry: 'fashion',
        thumbnail: 'https://images.pexels.com/photos/994517/pexels-photo-994517.jpeg?auto=compress&cs=tinysrgb&w=400',
        demoUrl: '#',
        features: ['Katalog Produk', 'Size Guide', 'Instagram Feed'],
        category: 'Butik'
      },
      {
        id: 'distro-casual',
        name: 'Distro Casual',
        industry: 'fashion',
        thumbnail: 'https://images.pexels.com/photos/1069155/pexels-photo-1069155.jpeg?auto=compress&cs=tinysrgb&w=400',
        demoUrl: '#',
        features: ['Koleksi Terbaru', 'Pre-Order', 'Testimonial'],
        category: 'Distro'
      }
    ]
  },
  {
    id: 'jasa',
    name: 'Jasa & Layanan',
    description: 'Salon, bengkel, konsultan, service',
    icon: '🔧',
    templates: [
      {
        id: 'salon-kecantikan',
        name: 'Salon Kecantikan',
        industry: 'jasa',
        thumbnail: 'https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&cs=tinysrgb&w=400',
        demoUrl: '#',
        features: ['Booking Online', 'Price List', 'Gallery'],
        category: 'Salon'
      },
      {
        id: 'bengkel-motor',
        name: 'Bengkel Motor',
        industry: 'jasa',
        thumbnail: 'https://images.pexels.com/photos/2244746/pexels-photo-2244746.jpeg?auto=compress&cs=tinysrgb&w=400',
        demoUrl: '#',
        features: ['Layanan Service', 'Kontak Darurat', 'Jam Buka'],
        category: 'Bengkel'
      }
    ]
  }
];