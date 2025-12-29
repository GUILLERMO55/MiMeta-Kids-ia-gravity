import React from 'react';
import { MobileLayout } from '../../layouts/MobileLayout';
// import { Button } from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { ChildHeader } from './components/ChildHeader';
import { ChildTaskList } from './components/ChildTaskList';
import { ChildRewards } from './components/ChildRewards';
import { FinancialEducation } from '../education/FinancialEducation';
import type { ChildProfile } from '../../types';

export const ChildDashboard: React.FC = () => {
    const navigate = useNavigate();
    const logout = useStore(state => state.setCurrentUser);
    const currentUser = useStore(state => state.currentUser) as ChildProfile;

    const handleLogout = () => {
        logout(null);
        navigate('/');
    };

    if (!currentUser) return null;

    return (
        <MobileLayout className="bg-slate-50 relative">
            {/* Decorative background circle */}
            <div className="absolute top-0 left-0 w-full h-64 bg-primary rounded-b-[3rem] z-0" />

            <div className="relative z-10 flex flex-col h-screen">
                <div className="p-4 flex justify-between items-center text-white/80">
                    <span className="text-xs font-bold uppercase tracking-widest opacity-70">MiMeta Kids</span>
                    <div className="flex items-center gap-3">
                        <button onClick={() => navigate('/settings')} className="text-xs font-bold uppercase hover:text-white transition-colors">⚙️</button>
                        <button onClick={handleLogout} className="text-xs font-bold uppercase hover:text-white transition-colors">Salir</button>
                    </div>
                </div>

                <div className="px-5 pb-20 overflow-y-auto flex-1 no-scrollbar space-y-8">
                    <ChildHeader child={currentUser} />
                    <ChildTaskList child={currentUser} />
                    <ChildRewards child={currentUser} />
                    <FinancialEducation />
                    <div className="h-10"></div>
                </div>
            </div>
        </MobileLayout>
    );
};
