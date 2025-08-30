import { TemplateOption } from '../types';

export const templateOptions: TemplateOption[] = [
  {
    id: 'custom-dashboard',
    name: 'Dashboard BisnisBAIK',
    description: 'Dashboard khusus yang mudah digunakan dengan fitur lengkap untuk bisnis Indonesia',
    icon: '🎯',
    features: [
      'Editor drag & drop yang mudah',
      'Integrasi WhatsApp otomatis',
      'Analytics bisnis Indonesia',
      'Template khusus industri lokal',
      'Support bahasa Indonesia',
      'Backup otomatis',
      'Mobile app management'
    ],
    price: 'Gratis - Rp 99rb/tahun',
    recommended: true
  },
  {
    id: 'wordpress',
    name: 'WordPress Dashboard',
    description: 'Gunakan WordPress yang familiar dengan ribuan plugin dan tema',
    icon: '📝',
    features: [
      'Dashboard WordPress standar',
      'Akses ke 50,000+ plugin',
      'Tema WordPress kompatibel',
      'SEO tools lengkap',
      'Community support besar',
      'Customization unlimited',
      'Export/import mudah'
    ],
    price: 'Rp 149rb/tahun'
  },
  {
    id: 'html-export',
    name: 'Export HTML',
    description: 'Download file HTML lengkap untuk hosting sendiri atau development lanjutan',
    icon: '💾',
    features: [
      'File HTML, CSS, JS lengkap',
      'Responsive design',
      'Clean code structure',
      'No dependencies',
      'Host dimana saja',
      'Full ownership',
      'Developer friendly'
    ],
    price: 'Rp 299rb sekali bayar'
  }
];