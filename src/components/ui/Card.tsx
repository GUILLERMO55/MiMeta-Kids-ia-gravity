import React from 'react';
import { cn } from './Button';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({ className, children, padding = 'md', ...props }) => {
    const paddings = {
        none: 'p-0',
        sm: 'p-3',
        md: 'p-5',
        lg: 'p-6',
    };

    return (
        <div className={cn('bg-white rounded-3xl shadow-sm border border-slate-100', paddings[padding], className)} {...props}>
            {children}
        </div>
    );
};
