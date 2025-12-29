import React from 'react';
import { cn } from './Button';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    fullWidth?: boolean;
}

export const Input: React.FC<InputProps> = ({
    className,
    label,
    error,
    fullWidth = true,
    id,
    ...props
}) => {
    const generatedId = id || Math.random().toString(36).substr(2, 9);

    return (
        <div className={cn('flex flex-col gap-1.5', fullWidth ? 'w-full' : 'w-auto')}>
            {label && (
                <label
                    htmlFor={generatedId}
                    className="text-sm font-semibold text-gray-700 ml-1"
                >
                    {label}
                </label>
            )}
            <input
                id={generatedId}
                className={cn(
                    'px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200',
                    error ? 'border-danger focus:ring-danger/20 focus:border-danger' : '',
                    className
                )}
                {...props}
            />
            {error && (
                <span className="text-xs text-danger font-medium ml-1">{error}</span>
            )}
        </div>
    );
};
