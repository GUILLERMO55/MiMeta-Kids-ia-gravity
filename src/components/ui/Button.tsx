import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
    size?: 'sm' | 'md' | 'lg' | 'icon';
    fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
    className,
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    children,
    ...props
}) => {
    const variants = {
        primary: 'bg-primary text-white hover:bg-primary-dark active:scale-95 shadow-md',
        secondary: 'bg-secondary text-white hover:bg-secondary-dark active:scale-95 shadow-md',
        danger: 'bg-danger text-white hover:bg-red-600 active:scale-95 shadow-md',
        ghost: 'bg-transparent text-gray-700 hover:bg-gray-100',
        outline: 'border-2 border-primary text-primary hover:bg-primary/5 active:scale-95',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-sm rounded-lg',
        md: 'px-4 py-3 text-base rounded-xl',
        lg: 'px-6 py-4 text-lg rounded-2xl',
        icon: 'p-2 rounded-full aspect-square flex items-center justify-center',
    };

    return (
        <button
            className={cn(
                'font-bold transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none',
                variants[variant],
                sizes[size],
                fullWidth ? 'w-full' : '',
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
};
