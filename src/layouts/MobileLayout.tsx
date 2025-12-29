import React from 'react';

interface MobileLayoutProps {
    children: React.ReactNode;
    className?: string;
}

export const MobileLayout: React.FC<MobileLayoutProps> = ({ children, className = '' }) => {
    return (
        <div className="min-h-screen w-full flex justify-center bg-gray-100">
            <div className={`w-full max-w-md bg-background min-h-screen shadow-2xl relative flex flex-col ${className}`}>
                {children}
            </div>
        </div>
    );
};
