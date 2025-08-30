import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  ShoppingCart,
  DollarSign,
  Download,
  BarChart3
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Tables } from '../../lib/supabase';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { PageLoader } from '../../components/LoadingSpinner';

interface DashboardStats {
  totalTemplates: number;
  totalTransactions: number;
  totalRevenue: number;
  totalDownloads: number;
}

export default function DashboardPage() {
  const { user, userProfile } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentProjects, setRecentProjects] = useState<Tables<'user_projects'>[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<Tables<'transactions'>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Fetch user projects and transactions in parallel
      const [projectsResult, transactionsResult] = await Promise.all([
        supabase
            .from('user_projects')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(5),
        supabase
            .from('transactions')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(5)
      ]);

      if (projectsResult.error) {
        console.error('Error fetching projects:', projectsResult.error);
      } else if (projectsResult.data) {
        setRecentProjects(projectsResult.data);
      }

      if (transactionsResult.error) {
        console.error('Error fetching transactions:', transactionsResult.error);
      } else if (transactionsResult.data) {
        setRecentTransactions(transactionsResult.data);
      }

      // Calculate stats
      const totalProjects = projectsResult.data?.length || 0;
      const totalTransactions = transactionsResult.data?.length || 0;
      const totalRevenue = transactionsResult.data?.reduce((sum, t) => sum + (t.amount || 0), 0) || 0;
      const totalDownloads = projectsResult.data?.reduce((sum, p) => sum + (p.downloads || 0), 0) || 0;

      setStats({
        totalTemplates: totalProjects,
        totalTransactions,
        totalRevenue,
        totalDownloads
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Terjadi kesalahan saat memuat data dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <PageLoader />;
  }

  if (error) {
    return (
        <DashboardLayout>
          <div className="p-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800">{error}</p>
              <button
                  onClick={fetchDashboardData}
                  className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Coba Lagi
              </button>
            </div>
          </div>
        </DashboardLayout>
    );
  }

  const statCards = [
    {
      title: 'Total Template',
      value: stats?.totalTemplates || 0,
      icon: FileText,
      color: 'bg-blue-500',
      description: 'Template yang dibeli'
    },
    {
      title: 'Total Transaksi',
      value: stats?.totalTransactions || 0,
      icon: ShoppingCart,
      color: 'bg-green-500',
      description: 'Transaksi berhasil'
    },
    {
      title: 'Total Pendapatan',
      value: `Rp ${(stats?.totalRevenue || 0).toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-yellow-500',
      description: 'Total pendapatan'
    },
    {
      title: 'Total Download',
      value: stats?.totalDownloads || 0,
      icon: Download,
      color: 'bg-purple-500',
      description: 'Template diunduh'
    }
  ];

  return (
      <DashboardLayout>
        <div className="p-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Dashboard
            </h1>
            <p className="text-gray-600">
              Selamat datang kembali, {userProfile?.full_name || user?.email || 'User'}!
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((stat, index) => (
                <motion.div
                    key={stat.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {stat.value}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {stat.description}
                      </p>
                    </div>
                    <div className={`${stat.color} p-3 rounded-lg`}>
                      <stat.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </motion.div>
            ))}
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Projects */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Project Terbaru
                </h3>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  Lihat Semua
                </button>
              </div>
              {recentProjects.length > 0 ? (
                  <div className="space-y-4">
                    {recentProjects.map((project) => (
                        <div key={project.id} className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <FileText className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {project.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              Dibuat {new Date(project.created_at).toLocaleDateString('id-ID')}
                            </p>
                          </div>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                              project.status === 'published' ? 'bg-green-100 text-green-800' :
                                  project.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                                      'bg-gray-100 text-gray-800'
                          }`}>
                      {project.status === 'published' ? 'Aktif' :
                          project.status === 'draft' ? 'Draft' :
                              project.status === 'archived' ? 'Arsip' : project.status}
                    </span>
                        </div>
                    ))}
                  </div>
              ) : (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500 mb-2">Belum ada project</p>
                    <p className="text-sm text-gray-400">
                      Mulai dengan memilih template dari gallery
                    </p>
                  </div>
              )}
            </motion.div>

            {/* Recent Transactions */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Transaksi Terbaru
                </h3>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  Lihat Semua
                </button>
              </div>
              {recentTransactions.length > 0 ? (
                  <div className="space-y-4">
                    {recentTransactions.map((transaction) => (
                        <div key={transaction.id} className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
                          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <DollarSign className="h-5 w-5 text-green-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {transaction.description || 'Pembelian Template'}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(transaction.created_at).toLocaleDateString('id-ID')}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">
                              Rp {transaction.amount?.toLocaleString() || '0'}
                            </p>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                                transaction.status === 'completed' ? 'bg-green-100 text-green-800' :
                                    transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-red-100 text-red-800'
                            }`}>
                        {transaction.status === 'completed' ? 'Selesai' :
                            transaction.status === 'pending' ? 'Pending' : transaction.status}
                      </span>
                          </div>
                        </div>
                    ))}
                  </div>
              ) : (
                  <div className="text-center py-8">
                    <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500 mb-2">Belum ada transaksi</p>
                    <p className="text-sm text-gray-400">
                      Transaksi akan muncul setelah pembelian template
                    </p>
                  </div>
              )}
            </motion.div>
          </div>
        </div>
      </DashboardLayout>
  );
}