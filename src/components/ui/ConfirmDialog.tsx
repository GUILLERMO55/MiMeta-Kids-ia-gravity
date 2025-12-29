import React from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { Button } from './Button';

interface ConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: 'danger' | 'warning' | 'info';
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmLabel = 'Confirmar',
    cancelLabel = 'Cancelar',
    variant = 'warning'
}) => {
    if (!isOpen) return null;

    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Dialog */}
            <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                >
                    <X size={18} className="text-slate-600 dark:text-slate-300" />
                </button>

                {/* Icon */}
                <div className={`
                    w-12 h-12 rounded-xl flex items-center justify-center mb-4
                    ${variant === 'danger' ? 'bg-red-100 dark:bg-red-900/30' :
                        variant === 'warning' ? 'bg-amber-100 dark:bg-amber-900/30' :
                            'bg-blue-100 dark:bg-blue-900/30'}
                `}>
                    <AlertTriangle
                        size={24}
                        className={
                            variant === 'danger' ? 'text-red-600 dark:text-red-400' :
                                variant === 'warning' ? 'text-amber-600 dark:text-amber-400' :
                                    'text-blue-600 dark:text-blue-400'
                        }
                    />
                </div>

                {/* Content */}
                <h2 className="text-xl font-black text-slate-800 dark:text-white mb-2">
                    {title}
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                    {message}
                </p>

                {/* Actions */}
                <div className="flex gap-3">
                    <Button
                        onClick={onClose}
                        variant="secondary"
                        fullWidth
                    >
                        {cancelLabel}
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        variant={variant === 'danger' ? 'danger' : 'primary'}
                        fullWidth
                    >
                        {confirmLabel}
                    </Button>
                </div>
            </div>
        </div>
    );
};
