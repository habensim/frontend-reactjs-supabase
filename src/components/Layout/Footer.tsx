import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Globe className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">BisnisBAIK</span>
            </div>
            <p className="text-sm">
              Platform terbaik untuk membuat website bisnis Anda dalam hitungan menit.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-white font-semibold mb-4">Produk</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/template" className="hover:text-white transition-colors">Template</Link></li>
              <li><Link to="/fitur" className="hover:text-white transition-colors">Fitur</Link></li>
              <li><Link to="/harga" className="hover:text-white transition-colors">Harga</Link></li>
              <li><Link to="/domain" className="hover:text-white transition-colors">Domain</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">Dukungan</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/bantuan" className="hover:text-white transition-colors">Bantuan</Link></li>
              <li><Link to="/tutorial" className="hover:text-white transition-colors">Tutorial</Link></li>
              <li><Link to="/kontak" className="hover:text-white transition-colors">Kontak</Link></li>
              <li><Link to="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Kontak</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>hello@bisnisbaik.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>+62 21 1234 5678</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Jakarta, Indonesia</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; 2025 BisnisBAIK. Semua hak dilindungi.</p>
        </div>
      </div>
    </footer>
  );
}