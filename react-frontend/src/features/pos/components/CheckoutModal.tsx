import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, CreditCard, Banknote, CheckCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../../services/api';
// @ts-ignore
import { BakongKHQR, MerchantInfo, khqrData } from 'bakong-khqr';

type PaymentMethod = 'CASH' | 'QR_CODE';

interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    totalAmount: number;
    onConfirm: (method: PaymentMethod) => void;
}

export default function CheckoutModal({ isOpen, onClose, totalAmount, onConfirm }: CheckoutModalProps) {
    const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('CASH');
    const [qrState, setQrState] = useState<'IDLE' | 'GENERATING' | 'WAITING' | 'SUCCESS'>('IDLE');
    const [khqrBakongId, setKhqrBakongId] = useState<string>('');
    const [khqrMerchantName, setKhqrMerchantName] = useState<string>('');

    useEffect(() => {
        if (isOpen) {
            setSelectedMethod('CASH');
            setQrState('IDLE');
            
            // Fetch configuration
            api.get("/settings/KHQR_BAKONG_ID").then(res => setKhqrBakongId(res.data.value)).catch(() => {});
            api.get("/settings/KHQR_MERCHANT_NAME").then(res => setKhqrMerchantName(res.data.value)).catch(() => {});
        }
    }, [isOpen]);

    useEffect(() => {
        // Removed auto-timer to allow manual simulation
    }, [selectedMethod, qrState]);

    const simulateCustomerScan = () => {
        setQrState('SUCCESS');
        setTimeout(() => {
            onConfirm('QR_CODE');
            onClose();
        }, 1500);
    };

    const handleMethodSelect = (method: PaymentMethod) => {
        setSelectedMethod(method);
        if (method === 'QR_CODE') {
            setQrState('GENERATING');
            setTimeout(() => setQrState('WAITING'), 800); // Simulate network delay for KHQR generation
        } else {
            setQrState('IDLE');
        }
    };

    const handleConfirmCash = () => {
        onConfirm('CASH');
        onClose();
    };

    // Generate a valid EMVCo KHQR payload using the official Bakong KHQR library
    const generateKHQRPayload = (amount: number) => {
        if (!khqrBakongId || !khqrMerchantName) {
            // Fallback mock if settings are not configured in the Admin Panel
            const formattedAmount = amount.toFixed(2);
            const amountLength = formattedAmount.length.toString().padStart(2, '0');
            return `00020101021129460016bakong@aba.kh0122bakong-id-1234567890520458125303USD54${amountLength}${formattedAmount}5802KH5913MTP Flyweight6010Phnom Penh6304A1B2`;
        }

        try {
            const merchant = new MerchantInfo(
                khqrBakongId,
                khqrMerchantName,
                'Phnom Penh',
                khqrBakongId.split('@')[0], // Generate a placeholder merchantID
                khqrMerchantName,
                { amount: amount, currency: khqrData?.currency?.usd || 840 }
            );
            const khqr = new BakongKHQR();
            const response = khqr.generateMerchant(merchant);
            return response?.data?.qr || "";
        } catch (error) {
            console.error("KHQR Generation failed:", error);
            return "";
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                    onClick={onClose}
                />
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh]"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800 shrink-0">
                        <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                            <CreditCard className="text-blue-600" /> Checkout
                        </h2>
                        <button 
                            onClick={onClose}
                            className="flex h-8 w-8 min-w-[2rem] min-h-[2rem] shrink-0 aspect-square items-center justify-center rounded-full p-0 bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-900 hover:rotate-90 hover:scale-110 active:scale-95 transition-all duration-300 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                        >
            <X size={20} />
                        </button>
                    </div>

                    <div className="p-6 overflow-y-auto custom-scrollbar">
                        {/* Total Amount Display */}
                        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 text-center mb-8 border border-slate-100 dark:border-slate-800">
                            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Total to Pay</p>
                            <h3 className="text-4xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                ${totalAmount.toFixed(2)}
                            </h3>
                        </div>

                        {/* Payment Method Selector */}
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <button
                                onClick={() => handleMethodSelect('CASH')}
                                className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${
                                    selectedMethod === 'CASH' 
                                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400' 
                                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-blue-300'
                                }`}
                            >
                                <Banknote size={32} className="mb-2" />
                                <span className="font-bold">Cash</span>
                            </button>
                            <button
                                onClick={() => handleMethodSelect('QR_CODE')}
                                className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${
                                    selectedMethod === 'QR_CODE' 
                                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400' 
                                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-indigo-300'
                                }`}
                            >
                                <div className="grid grid-cols-2 gap-0.5 mb-2 w-8 h-8 opacity-80">
                                    <div className="bg-current rounded-sm"></div>
                                    <div className="bg-current rounded-sm"></div>
                                    <div className="bg-current rounded-sm"></div>
                                    <div className="bg-current rounded-sm"></div>
                                </div>
                                <span className="font-bold">KHQR Scan</span>
                            </button>
                        </div>

                        {/* Dynamic Payment Area */}
                        <div className="min-h-[280px] flex flex-col items-center justify-center">
                            {selectedMethod === 'CASH' ? (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                    className="w-full"
                                >
                                    <button 
                                        onClick={handleConfirmCash}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-600/20 transition-all active:scale-[0.98] text-lg"
                                    >
                                        Confirm Exact Cash Received
                                    </button>
                                </motion.div>
                            ) : (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                    className="flex flex-col items-center w-full"
                                >
                                    {qrState === 'GENERATING' && (
                                        <div className="flex flex-col items-center justify-center space-y-4 py-12">
                                            <Loader2 className="animate-spin text-indigo-500" size={48} />
                                            <p className="text-slate-500 font-medium">Generating KHQR...</p>
                                        </div>
                                    )}

                                    {qrState === 'WAITING' && (
                                        <div className="flex flex-col items-center space-y-4">
                                            <div className="bg-white p-3 rounded-3xl shadow-sm border border-indigo-100 dark:border-indigo-900">
                                                <QRCodeSVG 
                                                    value={generateKHQRPayload(totalAmount)} 
                                                    size={180}
                                                    level="M"
                                                    includeMargin={false}
                                                    fgColor="#1e1b4b"
                                                />
                                            </div>
                                            <button 
                                                onClick={simulateCustomerScan}
                                                className="w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-bold py-3 rounded-xl border border-indigo-200 transition-colors flex items-center justify-center gap-2 mt-2"
                                            >
                                                <span className="relative flex h-3 w-3">
                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
                                                </span>
                                                Simulate Customer Scan
                                            </button>
                                        </div>
                                    )}

                                    {qrState === 'SUCCESS' && (
                                        <motion.div 
                                            initial={{ scale: 0 }} animate={{ scale: 1 }}
                                            className="flex flex-col items-center space-y-4 py-8 text-emerald-500"
                                        >
                                            <CheckCircle size={80} strokeWidth={2.5} />
                                            <h3 className="text-2xl font-black text-slate-900 dark:text-white">Payment Received!</h3>
                                            <p className="text-slate-500 font-medium">Processing receipt...</p>
                                        </motion.div>
                                    )}
                                </motion.div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
