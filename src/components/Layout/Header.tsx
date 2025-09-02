import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Globe, Menu, X, User, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface HeaderProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
}

export default function Header({ isMenuOpen, setIsMenuOpen }: HeaderProps) {
  const { user, userProfile, signOut } = useAuth();

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setIsProfileMenuOpen(false); // Close menu on logout
  };

  const closeMobileMenu = () => setIsMenuOpen(false);

  return (
      <header className="bg-white shadow-sm border-b border-gray-100 relative z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Globe className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">BisnisBAIK</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/template" className="text-gray-600 hover:text-blue-600 transition-colors">
                Template
              </Link>
              <Link to="/harga" className="text-gray-600 hover:text-blue-600 transition-colors">
                Harga
              </Link>
              <Link to="/bantuan" className="text-gray-600 hover:text-blue-600 transition-colors">
                Bantuan
              </Link>

              {/* Conditional rendering based on user session */}
              {user ? (
                  <div className="relative" ref={profileMenuRef}>
                    <button
                        onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                        className="flex items-center space-x-2 focus:outline-none"
                    >
                      <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center">
                        {userProfile?.avatar_url ? (
                            <img
                                src={userProfile.avatar_url}
                                alt={userProfile.full_name || 'User Avatar'}
                                className="w-9 h-9 rounded-full object-cover"
                            />
                        ) : (
                            <User className="h-5 w-5 text-white" />
                        )}
                      </div>
                    </button>
                    {isProfileMenuOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border border-gray-200">
                          <div className="px-4 py-2 border-b">
                            <p className="text-sm font-medium text-gray-900 truncate">{userProfile?.full_name || 'User'}</p>
                            <p className="text-xs text-gray-500 truncate">{user.email}</p>
                          </div>
                          <Link
                              to="/dashboard"
                              className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() => setIsProfileMenuOpen(false)}
                          >
                            <LayoutDashboard className="mr-2 h-4 w-4" />
                            Dashboard
                          </Link>
                          <button
                              onClick={handleSignOut}
                              className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                          >
                            <LogOut className="mr-2 h-4 w-4" />
                            Keluar
                          </button>
                        </div>
                    )}
                  </div>
              ) : (
                  <div className="flex items-center space-x-4">
                    <Link
                        to="/masuk"
                        className="text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      Masuk
                    </Link>
                    <Link
                        to="/pilih-industri"
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Mulai Gratis
                    </Link>
                  </div>
              )}
            </nav>

            {/* Mobile menu button */}
            <button
                className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
            <div className="md:hidden absolute top-16 left-0 right-0 bg-white border-b border-gray-200 shadow-lg">
              <nav className="px-4 py-4 space-y-3">
                <Link
                    to="/template"
                    className="block px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
                    onClick={closeMobileMenu}
                >
                  Template
                </Link>
                <Link
                    to="/harga"
                    className="block px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
                    onClick={closeMobileMenu}
                >
                  Harga
                </Link>
                <Link
                    to="/bantuan"
                    className="block px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
                    onClick={closeMobileMenu}
                >
                  Bantuan
                </Link>
                <hr className="border-gray-200" />

                {/* Conditional rendering for mobile menu */}
                {user ? (
                    <>
                      <Link
                          to="/dashboard"
                          className="block px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
                          onClick={closeMobileMenu}
                      >
                        Dashboard
                      </Link>
                      <button
                          onClick={() => {
                            handleSignOut();
                            closeMobileMenu();
                          }}
                          className="block w-full text-left bg-red-50 text-red-600 px-3 py-2 rounded-md hover:bg-red-100 transition-colors"
                      >
                        Keluar
                      </button>
                    </>
                ) : (
                    <>
                      <Link
                          to="/masuk"
                          className="block px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
                          onClick={closeMobileMenu}
                      >
                        Masuk
                      </Link>
                      <Link
                          to="/pilih-industri"
                          className="block text-center bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 transition-colors"
                          onClick={closeMobileMenu}
                      >
                        Mulai Gratis
                      </Link>
                    </>
                )}
              </nav>
            </div>
        )}
      </header>
  );
}