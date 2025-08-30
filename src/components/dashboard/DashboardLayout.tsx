import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  FileText, 
  ShoppingCart, 
  BarChart3, 
  Settings, 
  User, 
  LogOut, 
  Menu, 
  X,
  Plus,
  Home,
  Globe
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import AccessibleButton from '../AccessibleButton';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Website', href: '/dashboard/website', icon: Globe },
  { name: 'Billing', href: '/dashboard/billing', icon: ShoppingCart },
  { name: 'Profil', href: '/dashboard/profile', icon: User },
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, userProfile, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const isActive = (href: string) => {
    return location.pathname === href || location.pathname.startsWith(href + '/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0">
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Home className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">BisnisBAIK</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 rounded-md text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* User Profile */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              {userProfile?.avatar_url ? (
                <img
                  src={userProfile.avatar_url}
                  alt={userProfile.full_name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <User className="h-6 w-6 text-white" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {userProfile?.full_name || 'User'}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {userProfile?.subscription_tier || 'free'} plan
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="px-3 py-4 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive(item.href)
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon
                  className={`mr-3 h-5 w-5 ${
                    isActive(item.href) ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                  }`}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Quick Actions */}
        <div className="px-3 py-4 border-t border-gray-200">
          <AccessibleButton
            variant="primary"
            size="sm"
            className="w-full"
            onClick={() => navigate('/dashboard/website')}
            ariaLabel="Buka website"
          >
            <Globe className="h-4 w-4 mr-2" />
            Buka Website
          </AccessibleButton>
        </div>

        {/* Sign Out */}
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-gray-200">
          <AccessibleButton
            variant="ghost"
            size="sm"
            className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={handleSignOut}
            ariaLabel="Keluar dari akun"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Keluar
          </AccessibleButton>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-30 bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600"
            >
              <Menu className="h-6 w-6" />
            </button>

            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                Selamat datang, <span className="font-medium text-gray-900">{userProfile?.full_name}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <main className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
