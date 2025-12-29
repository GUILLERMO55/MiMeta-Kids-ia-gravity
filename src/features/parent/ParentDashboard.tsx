import React, { useState } from 'react';
import { MobileLayout } from '../../layouts/MobileLayout';
import { Button } from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { ParentTaskList } from './components/ParentTaskList';
import { ParentWallet } from './components/ParentWallet';
import { CreateTaskModal } from './components/CreateTaskModal';
import { cn } from '../../components/ui/Button';
import { ChildHeader } from '../child/components/ChildHeader';
import { ChildTaskList } from '../child/components/ChildTaskList';
import { ChildRewards } from '../child/components/ChildRewards';
import { FinancialEducation } from '../education/FinancialEducation';
import { ArrowLeft } from 'lucide-react';

type Tab = 'tasks' | 'wallet' | 'settings';

export const ParentDashboard: React.FC = () => {
    const navigate = useNavigate();
    const logout = useStore(state => state.setCurrentUser);
    const [activeTab, setActiveTab] = useState<Tab>('tasks');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isPreviewing, setIsPreviewing] = useState(false);
    const users = useStore(state => state.users);
    const filterChildId = useStore(state => state.filterChildId);
    const setFilterChildId = useStore(state => state.setFilterChildId);

    const children = users.filter(u => u.role === 'child');
    const selectedChild = children.find(c => c.id === filterChildId);

    // Default to the first child if there's only one child
    React.useEffect(() => {
        if (children.length === 1 && filterChildId === null) {
            setFilterChildId(children[0].id);
        }
    }, [children, filterChildId, setFilterChildId]);

    const handleCycleChild = () => {
        if (children.length <= 1) return;

        if (filterChildId === null) {
            setFilterChildId(children[0].id);
        } else {
            const currentIndex = children.findIndex(c => c.id === filterChildId);
            if (currentIndex === children.length - 1) {
                setFilterChildId(null);
            } else {
                setFilterChildId(children[currentIndex + 1].id);
            }
        }
    };

    const handleLogout = () => {
        if (isPreviewing) {
            setIsPreviewing(false);
        } else {
            logout(null);
            navigate('/');
        }
    };

    const NavButton = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: string, label: string }) => (
        <button
            onClick={onClick}
            className={cn(
                "flex flex-col items-center gap-1 transition-all duration-200",
                active ? "text-primary scale-110" : "text-gray-400 hover:text-gray-600"
            )}
        >
            <span className="text-2xl">{icon}</span>
            <span className="text-[10px] font-bold uppercase tracking-wide">{label}</span>
        </button>
    );

    return (
        <MobileLayout className="bg-gray-50 dark:bg-slate-900 flex flex-col transition-colors duration-300">
            {/* Header */}
            <div className="px-6 py-4 flex justify-between items-center bg-white dark:bg-slate-800 border-b border-gray-100 dark:border-slate-700 sticky top-0 z-30 transition-colors duration-300">
                <div
                    className={cn(
                        "flex items-center gap-3",
                        children.length > 1 ? "cursor-pointer active:scale-95 transition-transform" : ""
                    )}
                    onClick={handleCycleChild}
                >
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-slate-700 flex items-center justify-center text-2xl shadow-sm border border-indigo-100 dark:border-slate-600 transition-colors">
                        {selectedChild ? selectedChild.avatar : '👥'}
                    </div>
                    <div>
                        <h1 className="text-lg font-black text-gray-900 dark:text-white leading-tight">
                            {selectedChild ? selectedChild.name : 'Todos los hijos'}
                        </h1>
                        <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest">
                            {children.length > 1 && filterChildId === null ? 'Vista Global' : 'Padre / Gestor'}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {selectedChild && !isPreviewing && (
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setIsPreviewing(true)}
                            className="text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 px-2 min-w-0"
                        >
                            <span className="text-xs font-bold">Ver</span>
                        </Button>
                    )}
                    <Button
                        size="sm"
                        variant="primary"
                        onClick={() => setIsCreateModalOpen(true)}
                        className="shadow-lg shadow-primary/20 rounded-full h-9 px-4 whitespace-nowrap"
                    >
                        <span className="text-sm font-bold">+ Tarea</span>
                    </Button>
                    <Button variant="ghost" size="sm" onClick={handleLogout} className="text-red-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 px-2 min-w-0">
                        <span className="text-xs font-bold">Salir</span>
                    </Button>
                </div>
            </div>

            {/* Content */}
            <div className={`flex-1 overflow-y-auto ${isPreviewing ? 'relative bg-slate-50' : 'p-5'}`}>
                {isPreviewing && selectedChild ? (
                    <div className="relative animate-in fade-in zoom-in-95 duration-300">
                        {/* Header for preview mode */}
                        <div className="sticky top-0 z-50 bg-indigo-600 text-white p-3 flex justify-between items-center shadow-lg">
                            <div className="flex items-center gap-2">
                                <span className="bg-white/20 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest">Vista Previa</span>
                                <span className="text-sm font-bold opacity-90">Viendo como: {selectedChild.name}</span>
                            </div>
                            <Button
                                size="sm"
                                variant="outline"
                                className="bg-white/10 border-white/20 text-white hover:bg-white/20 h-8 px-3 text-xs"
                                onClick={() => setIsPreviewing(false)}
                            >
                                <ArrowLeft size={14} className="mr-1" /> Volver al Panel
                            </Button>
                        </div>

                        {/* Child Dashboard Content Clone */}
                        <div className="p-0 space-y-0 min-h-screen pb-20">
                            <div className="absolute top-0 left-0 w-full h-64 bg-primary rounded-b-[3rem] z-0" />
                            <div className="relative z-10 px-5 pt-8 space-y-8">
                                <ChildHeader child={selectedChild} />
                                <ChildTaskList child={selectedChild} />
                                <ChildRewards child={selectedChild} />
                                <FinancialEducation />
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        {activeTab === 'tasks' && <ParentTaskList />}
                        {activeTab === 'wallet' && <ParentWallet />}
                        {activeTab === 'settings' && (
                            <div className="text-center text-gray-500 dark:text-slate-400 mt-10 space-y-4">
                                <p>Configuración en construcción</p>
                                <Button variant="outline" size="sm" onClick={() => useStore.getState().switchChildMode('under12')}>Modo Infantil</Button>
                                <Button variant="outline" size="sm" onClick={() => useStore.getState().switchChildMode('under18')}>Modo Adolescente</Button>
                            </div>
                        )}
                    </>
                )}
            </div>

            <CreateTaskModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
            />

            {/* Bottom Nav */}
            <div className="bg-white dark:bg-slate-800 border-t border-gray-100 dark:border-slate-700 px-6 py-3 flex justify-between items-center shadow-[0_-5px_20px_rgba(0,0,0,0.03)] dark:shadow-[0_-5px_20px_rgba(0,0,0,0.5)] sticky bottom-0 z-20 transition-colors duration-300">
                <NavButton
                    active={activeTab === 'tasks'}
                    onClick={() => setActiveTab('tasks')}
                    icon="📝"
                    label="Tareas"
                />
                <NavButton
                    active={activeTab === 'wallet'}
                    onClick={() => setActiveTab('wallet')}
                    icon="💰"
                    label="Monedero"
                />
                <NavButton
                    active={activeTab === 'settings'}
                    onClick={() => navigate('/settings')}
                    icon="⚙️"
                    label="Ajustes"
                />
            </div>
        </MobileLayout>
    );
};
