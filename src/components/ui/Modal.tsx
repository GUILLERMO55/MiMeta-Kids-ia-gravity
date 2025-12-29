import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Button } from './Button';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Panel */}
            <div className="relative bg-white w-full max-w-lg rounded-t-3xl sm:rounded-2xl shadow-xl flex flex-col max-h-[90vh] animate-in slide-in-from-bottom-10 fade-in duration-300">
                <div className="flex justify-between items-center p-4 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-gray-900">{title}</h2>
                    <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full w-8 h-8 text-gray-400">
                        ✕
                    </Button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                    {children}
                </div>
            </div>
        </div>,
        document.body
    );
};
