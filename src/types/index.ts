export interface Industry {
  id: string;
  name: string;
  description: string;
  icon: string;
  templates: Template[];
}

export interface Template {
  id: string;
  name: string;
  industry: string;
  thumbnail: string;
  demoUrl: string;
  features: string[];
  category: string;
}

export interface BusinessInfo {
  nama: string;
  tagline: string;
  deskripsi: string;
  whatsapp: string;
  email: string;
  alamat: string;
  mapsLink?: string;
  jamOperasional: {
    senin_jumat: { buka: string; tutup: string };
    sabtu_minggu: { buka: string; tutup: string };
    buka24jam: boolean;
  };
}

export interface MenuItem {
  id: string;
  nama: string;
  harga: number;
  deskripsi: string;
  kategori: string;
  gambar?: string;
}

export interface WebsiteCustomization {
  warna: string;
  logo?: string;
  textLogo?: string;
  font: string;
  banner?: string;
  kontakUtama: 'whatsapp' | 'telepon' | 'keduanya';
}

export interface User {
  email: string;
  nama: string;
  whatsapp: string;
}

export interface TemplateOption {
  id: 'custom-dashboard' | 'wordpress' | 'html-export';
  name: string;
  description: string;
  icon: string;
  features: string[];
  price: string;
  recommended?: boolean;
}