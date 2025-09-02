import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

// Define a type for the transaction data we expect to fetch
type Transaction = {
    id: string;
    amount: number;
    va_bank: string;
    va_number: string;
    status: 'pending' | 'completed' | 'failed';
};

export default function MockPaymentPage() {
    const [searchParams] = useSearchParams();
    const { user } = useAuth();
    const transactionId = searchParams.get('txn_id');

    const [transaction, setTransaction] = useState<Transaction | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [processing, setProcessing] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);

    useEffect(() => {
        if (!transactionId || !user) {
            setLoading(false);
            setError('ID Transaksi tidak valid atau Anda belum login.');
            return;
        }

        const fetchTransaction = async () => {
            try {
                const { data, error } = await supabase
                    .from('transactions')
                    .select('id, amount, va_bank, va_number, status')
                    .eq('id', transactionId)
                    .eq('user_id', user.id) // Ensure the user owns this transaction
                    .single();

                if (error) throw new Error('Gagal mengambil detail transaksi.');
                if (data) {
                    setTransaction(data as Transaction);
                    if (data.status === 'completed') {
                        setPaymentSuccess(true);
                    }
                }
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTransaction();
    }, [transactionId, user]);

    const handleFulfill = async () => {
        if (!transactionId) return;

        setProcessing(true);
        setError(null);

        try {
            const { error } = await supabase.functions.invoke('fulfill-mock-va', {
                body: { transaction_id: transactionId },
            });

            if (error) throw new Error(error.message);

            setPaymentSuccess(true);
            setTimeout(() => window.close(), 3000); // Close tab after 3 seconds
        } catch (err: any) {
            setError(`Pembayaran Gagal: ${err.message}`);
        } finally {
            setProcessing(false);
        }
    };

    const formatPrice = (price: number) =>
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(price);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Halaman MockPay</h1>
                <p className="text-gray-600 mb-6">Ini adalah simulasi halaman pembayaran.</p>

                {loading && <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-600" />}

                {error && (
                    <div className="bg-red-50 text-red-700 p-3 rounded-lg flex items-center justify-center">
                        <XCircle className="h-5 w-5 mr-2" />
                        <span>{error}</span>
                    </div>
                )}

                {transaction && !paymentSuccess && (
                    <div className="text-left space-y-4 my-6 p-4 border rounded-lg bg-gray-50">
                        <div>
                            <p className="text-sm text-gray-500">Jumlah</p>
                            <p className="text-xl font-bold text-blue-600">{formatPrice(transaction.amount)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Bank Virtual Account</p>
                            <p className="font-semibold">{transaction.va_bank}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Nomor Virtual Account</p>
                            <p className="font-semibold font-mono">{transaction.va_number}</p>
                        </div>
                    </div>
                )}

                {paymentSuccess && (
                    <div className="my-6 p-4 rounded-lg bg-green-50 text-green-700 flex flex-col items-center">
                        <CheckCircle className="h-12 w-12 mb-3" />
                        <h2 className="text-xl font-bold">Pembayaran Berhasil!</h2>
                        <p className="text-sm">Tab ini akan tertutup dalam 3 detik...</p>
                    </div>
                )}

                {transaction && !paymentSuccess && (
                    <button
                        onClick={handleFulfill}
                        disabled={processing}
                        className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all disabled:opacity-50 flex items-center justify-center"
                    >
                        {processing ? (
                            <Loader2 className="h-5 w-5 animate-spin mr-2" />
                        ) : (
                            <CheckCircle className="h-5 w-5 mr-2" />
                        )}
                        Tandai Lunas (Simulasi)
                    </button>
                )}
            </div>
        </div>
    );
}
