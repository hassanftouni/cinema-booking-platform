'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle, CheckCircle, Info } from 'lucide-react';

interface AlertModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    message: string;
    type?: 'success' | 'error' | 'info';
}

export function AlertModal({ isOpen, onClose, title, message, type = 'info' }: AlertModalProps) {
    const icons = {
        success: <CheckCircle className="w-12 h-12 text-green-500" />,
        error: <AlertCircle className="w-12 h-12 text-red-500" />,
        info: <Info className="w-12 h-12 text-gold-500" />
    };

    const titles = {
        success: title || 'Success',
        error: title || 'Error',
        info: title || 'Notice'
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative bg-neutral-900 border border-gold-500/30 rounded-2xl p-8 max-w-md w-full shadow-2xl"
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-400" />
                        </button>

                        {/* Content */}
                        <div className="flex flex-col items-center text-center space-y-4">
                            {icons[type]}
                            <h2 className="text-2xl font-bold text-white">{titles[type]}</h2>
                            <p className="text-gray-300 leading-relaxed">{message}</p>

                            <button
                                onClick={onClose}
                                className="mt-4 px-8 py-3 bg-gold-600 hover:bg-gold-500 text-black font-bold rounded-lg transition-all transform hover:scale-105"
                            >
                                OK
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'danger' | 'warning' | 'info';
}

export function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    type = 'warning'
}: ConfirmModalProps) {
    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    const icons = {
        danger: <AlertCircle className="w-12 h-12 text-red-500" />,
        warning: <AlertCircle className="w-12 h-12 text-yellow-500" />,
        info: <Info className="w-12 h-12 text-gold-500" />
    };

    const titles = {
        danger: title || 'Confirm Deletion',
        warning: title || 'Confirm Action',
        info: title || 'Confirm'
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative bg-neutral-900 border border-gold-500/30 rounded-2xl p-8 max-w-md w-full shadow-2xl"
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-400" />
                        </button>

                        {/* Content */}
                        <div className="flex flex-col items-center text-center space-y-4">
                            {icons[type]}
                            <h2 className="text-2xl font-bold text-white">{titles[type]}</h2>
                            <p className="text-gray-300 leading-relaxed">{message}</p>

                            <div className="flex gap-4 mt-6 w-full">
                                <button
                                    onClick={onClose}
                                    className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-lg transition-all"
                                >
                                    {cancelText}
                                </button>
                                <button
                                    onClick={handleConfirm}
                                    className={`flex-1 px-6 py-3 font-bold rounded-lg transition-all transform hover:scale-105 ${type === 'danger'
                                            ? 'bg-red-600 hover:bg-red-500 text-white'
                                            : 'bg-gold-600 hover:bg-gold-500 text-black'
                                        }`}
                                >
                                    {confirmText}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
