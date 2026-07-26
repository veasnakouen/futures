import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, CreditCard, Banknote, CheckCircle, Loader2, ArrowRight, UserCheck, ShieldCheck, DollarSign } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../../services/api';
// @ts-ignore
import { BakongKHQR, MerchantInfo, khqrData } from 'bakong-khqr';

type PaymentMethod = 'CASH' | 'QR_CODE' | 'CARD';

export interface CustomerProfile {
    id: string;
    name: string;
    type: 'WALK_IN' | 'PATIENT' | 'GUEST' | 'STUDENT' | 'CLIENT';
    info?: string;
}

const CUSTOMER_OPTIONS: CustomerProfile[] = [
    { id: 'c-0', name: 'Walk-in Customer (General)', type: 'WALK_IN' },
    { id: 'c-1', name: 'Sokha Chan (Patient #PT-8801)', type: 'PATIENT', info: 'Clinic OPD' },
    { id: 'c-2', name: 'Michael Scott (Guest Room #304)', type: 'GUEST', info: 'Hotel Deluxe' },
    { id: 'c-3', name: 'Vireak Bopha (Student #ST-104)', type: 'STUDENT', info: 'Grade 11-A' },
];

interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    totalAmount: number;
    subtotalAmount?: number;
    taxAmount?: number;
    discountAmount?: number;
    onConfirm: (checkoutDetails: {
        paymentMethod: PaymentMethod;
        tenderedAmount: number;
        changeAmount: number;
        customer: CustomerProfile;
        cardAuthCode?: string;
    }) => void;
}

export default function CheckoutModal({
    isOpen,
    onClose,
    totalAmount,
    onConfirm,
}: CheckoutModalProps) {
    const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('CASH');
    const [qrState, setQrState] = useState<'IDLE' | 'GENERATING' | 'WAITING' | 'SUCCESS'>('IDLE');
    const [khqrBakongId, setKhqrBakongId] = useState<string>('');
    const [khqrMerchantName, setKhqrMerchantName] = useState<string>('');
    
    // Tendered cash calculation
    const [tenderedInput, setTenderedInput] = useState<string>('');
    const [selectedCustomer, setSelectedCustomer] = useState<CustomerProfile>(CUSTOMER_OPTIONS[0]);
    const [cardAuthCode, setCardAuthCode] = useState<string>('');
    const [cardProcessing, setCardProcessing] = useState<boolean>(false);

    const exchangeRateKHR = 4100; // 1 USD = 4100 KHR

    useEffect(() => {
        if (isOpen) {
            setSelectedMethod('CASH');
            setQrState('IDLE');
            setTenderedInput(totalAmount.toFixed(2));
            setSelectedCustomer(CUSTOMER_OPTIONS[0]);
            setCardAuthCode('');
            setCardProcessing(false);
            
            // Fetch KHQR Configuration from backend settings
            api.get("/settings/KHQR_BAKONG_ID").then(res => setKhqrBakongId(res.data.value)).catch(() => {});
            api.get("/settings/KHQR_MERCHANT_NAME").then(res => setKhqrMerchantName(res.data.value)).catch(() => {});
        }
    }, [isOpen, totalAmount]);

    const tenderedNum = parseFloat(tenderedInput) || 0;
    const changeDueUSD = Math.max(0, tenderedNum - totalAmount);
    const changeDueKHR = Math.round(changeDueUSD * exchangeRateKHR);
    const isCashInsufficient = selectedMethod === 'CASH' && tenderedNum < totalAmount;

    const simulateCustomerScan = () => {
        setQrState('SUCCESS');
        setTimeout(() => {
            onConfirm({
                paymentMethod: 'QR_CODE',
                tenderedAmount: totalAmount,
                changeAmount: 0,
                customer: selectedCustomer,
            });
            onClose();
        }, 1200);
    };

    const handleMethodSelect = (method: PaymentMethod) => {
        setSelectedMethod(method);
        if (method === 'QR_CODE') {
            setQrState('GENERATING');
            setTimeout(() => setQrState('WAITING'), 600);
        } else {
            setQrState('IDLE');
        }
    };

    const handleQuickTender = (amount: number) => {
        setTenderedInput(amount.toString());
    };

    const handleConfirmCash = () => {
        if (isCashInsufficient) return;
        onConfirm({
            paymentMethod: 'CASH',
            tenderedAmount: tenderedNum,
            changeAmount: changeDueUSD,
            customer: selectedCustomer,
        });
        onClose();
    };

    const handleConfirmCard = () => {
        setCardProcessing(true);
        setTimeout(() => {
            onConfirm({
                paymentMethod: 'CARD',
                tenderedAmount: totalAmount,
                changeAmount: 0,
                customer: selectedCustomer,
                cardAuthCode: cardAuthCode || `AUTH-${Math.floor(100000 + Math.random() * 900000)}`
            });
            setCardProcessing(false);
            onClose();
        }, 1000);
    };

    // Generate a valid EMVCo KHQR payload using the official Bakong KHQR library
    const generateKHQRPayload = (amount: number) => {
        if (!khqrBakongId || !khqrMerchantName) {
            const formattedAmount = amount.toFixed(2);
            const amountLength = formattedAmount.length.toString().padStart(2, '0');
            return `00020101021129460016bakong@aba.kh0122bakong-id-1234567890520458125303USD54${amountLength}${formattedAmount}5802KH5913MTP Enterprise6010Phnom Penh6304A1B2`;
        }

        try {
            const merchant = new MerchantInfo(
                khqrBakongId,
                khqrMerchantName,
                'Phnom Penh',
                khqrBakongId.split('@')[0],
                khqrMerchantName,
                { amount: amount, currency: khqrData?.currency?.usd || 840 }
            );
            const khqr = new BakongKHQR();
            const response = khqr.generateMerchant(merchant);
            return response?.data?.qr || "";
        } catch (error) {
            console.error("KHQR Generation error:", error);
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
                    className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 flex flex-col max-h-[92vh]"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800 shrink-0">
                        <div>
                            <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                                <CreditCard className="text-blue-600" /> POS Checkout Terminal
                            </h2>
                            <p className="text-xs text-slate-500 font-medium">Select customer profile and payment method</p>
                        </div>
                        <button 
                            onClick={onClose}
                            className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="p-6 overflow-y-auto custom-scrollbar space-y-6">
                        {/* Customer Profile Selector */}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
                                <UserCheck size={14} className="text-blue-500" /> Customer / Account Profile
                            </label>
                            <select
                                value={selectedCustomer.id}
                                onChange={(e) => {
                                    const found = CUSTOMER_OPTIONS.find(c => c.id === e.target.value);
                                    if (found) setSelectedCustomer(found);
                                }}
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            >
                                {CUSTOMER_OPTIONS.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name} {c.info ? `— (${c.info})` : ''}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Total Amount & Currency Display */}
                        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-5 text-white shadow-lg relative overflow-hidden flex justify-between items-center">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-blue-100 mb-1">Total Payable</p>
                                <h3 className="text-3xl font-black">${totalAmount.toFixed(2)}</h3>
                            </div>
                            <div className="text-right">
                                <p className="text-xs font-semibold text-blue-200 mb-1">Equivalent KHR</p>
                                <p className="text-lg font-extrabold text-blue-100">៛{(Math.round(totalAmount * exchangeRateKHR)).toLocaleString()}</p>
                            </div>
                        </div>

                        {/* Payment Method Tabs */}
                        <div className="grid grid-cols-3 gap-3">
                            <button
                                onClick={() => handleMethodSelect('CASH')}
                                className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border-2 transition-all ${
                                    selectedMethod === 'CASH' 
                                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 font-bold' 
                                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-blue-300'
                                }`}
                            >
                                <Banknote size={24} className="mb-1" />
                                <span className="text-xs font-bold">Cash</span>
                            </button>

                            <button
                                onClick={() => handleMethodSelect('QR_CODE')}
                                className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border-2 transition-all ${
                                    selectedMethod === 'QR_CODE' 
                                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-400 font-bold' 
                                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-indigo-300'
                                }`}
                            >
                                <div className="grid grid-cols-2 gap-0.5 mb-1 w-6 h-6 opacity-90">
                                    <div className="bg-current rounded-sm"></div>
                                    <div className="bg-current rounded-sm"></div>
                                    <div className="bg-current rounded-sm"></div>
                                    <div className="bg-current rounded-sm"></div>
                                </div>
                                <span className="text-xs font-bold">KHQR Scan</span>
                            </button>

                            <button
                                onClick={() => handleMethodSelect('CARD')}
                                className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border-2 transition-all ${
                                    selectedMethod === 'CARD' 
                                    ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 font-bold' 
                                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-emerald-300'
                                }`}
                            >
                                <CreditCard size={24} className="mb-1" />
                                <span className="text-xs font-bold">Card</span>
                            </button>
                        </div>

                        {/* CASH MODE */}
                        {selectedMethod === 'CASH' && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                                        Tendered Cash Amount ($ USD)
                                    </label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3.5 top-3 text-slate-400" size={18} />
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={tenderedInput}
                                            onChange={(e) => setTenderedInput(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-lg font-black focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>

                                {/* Quick Tender Buttons */}
                                <div>
                                    <p className="text-xs font-semibold text-slate-400 mb-1.5">Quick Presets</p>
                                    <div className="flex flex-wrap gap-2">
                                        {[totalAmount, 5, 10, 20, 50, 100].map((preset, idx) => (
                                            <button
                                                key={idx}
                                                type="button"
                                                onClick={() => handleQuickTender(preset)}
                                                className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 rounded-lg transition-colors"
                                            >
                                                {preset === totalAmount ? 'Exact' : `$${preset}`}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Change Calculation Display */}
                                <div className={`p-4 rounded-xl border ${isCashInsufficient ? 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/50' : 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/50'} flex justify-between items-center`}>
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Change Due</p>
                                        {isCashInsufficient ? (
                                            <p className="text-xs font-bold text-amber-600 dark:text-amber-400 mt-0.5">
                                                Insufficient cash (${(totalAmount - tenderedNum).toFixed(2)} needed)
                                            </p>
                                        ) : (
                                            <h4 className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                                                ${changeDueUSD.toFixed(2)}
                                            </h4>
                                        )}
                                    </div>
                                    {!isCashInsufficient && (
                                        <div className="text-right">
                                            <span className="text-xs font-bold text-slate-400">In KHR</span>
                                            <p className="text-sm font-extrabold text-emerald-700 dark:text-emerald-300">
                                                ៛{changeDueKHR.toLocaleString()}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <button 
                                    onClick={handleConfirmCash}
                                    disabled={isCashInsufficient}
                                    className={`w-full font-black py-3.5 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 text-base ${
                                        isCashInsufficient 
                                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed dark:bg-slate-800 dark:text-slate-600' 
                                        : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20 active:scale-[0.98]'
                                    }`}
                                >
                                    Complete Cash Transaction <ArrowRight size={18} />
                                </button>
                            </motion.div>
                        )}

                        {/* KHQR SCAN MODE */}
                        {selectedMethod === 'QR_CODE' && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center">
                                {qrState === 'GENERATING' && (
                                    <div className="flex flex-col items-center justify-center space-y-3 py-10">
                                        <Loader2 className="animate-spin text-indigo-500" size={44} />
                                        <p className="text-xs font-semibold text-slate-500">Generating EMVCo KHQR Payload...</p>
                                    </div>
                                )}

                                {qrState === 'WAITING' && (
                                    <div className="flex flex-col items-center space-y-4 w-full">
                                        <div className="bg-white p-3 rounded-2xl shadow-md border border-slate-100 dark:border-slate-800">
                                            <QRCodeSVG 
                                                value={generateKHQRPayload(totalAmount)} 
                                                size={170}
                                                level="M"
                                                includeMargin={false}
                                                fgColor="#1e1b4b"
                                            />
                                        </div>
                                        <p className="text-xs font-medium text-slate-500 text-center">
                                            Scan with ABA Mobile, ACLEDA, or Bakong App
                                        </p>
                                        <button 
                                            onClick={simulateCustomerScan}
                                            className="w-full bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:hover:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 font-bold py-3 rounded-xl border border-indigo-200 dark:border-indigo-800 transition-colors flex items-center justify-center gap-2"
                                        >
                                            <span className="relative flex h-3 w-3">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
                                            </span>
                                            Simulate KHQR Payment Received
                                        </button>
                                    </div>
                                )}

                                {qrState === 'SUCCESS' && (
                                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex flex-col items-center space-y-3 py-6 text-emerald-500">
                                        <CheckCircle size={72} strokeWidth={2.5} />
                                        <h3 className="text-xl font-black text-slate-900 dark:text-white">Payment Confirmed!</h3>
                                        <p className="text-xs font-medium text-slate-500">Generating receipt...</p>
                                    </motion.div>
                                )}
                            </motion.div>
                        )}

                        {/* CARD MODE */}
                        {selectedMethod === 'CARD' && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                                        POS Terminal Reference / Auth Code (Optional)
                                    </label>
                                    <input
                                        type="text"
                                        value={cardAuthCode}
                                        onChange={(e) => setCardAuthCode(e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                        placeholder="e.g. AUTH-981245"
                                    />
                                </div>
                                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-3">
                                    <ShieldCheck className="text-emerald-500 shrink-0" size={24} />
                                    <p className="text-xs text-slate-500 font-medium">Swipe, Insert, or Tap card on POS Terminal Hardware</p>
                                </div>
                                <button 
                                    onClick={handleConfirmCard}
                                    disabled={cardProcessing}
                                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3.5 rounded-2xl shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 text-base active:scale-[0.98]"
                                >
                                    {cardProcessing ? <Loader2 className="animate-spin" size={20} /> : <>Approve Card Transaction <ArrowRight size={18} /></>}
                                </button>
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
