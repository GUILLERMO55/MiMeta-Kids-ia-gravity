import React from 'react';
import { useStore } from '../../store/useStore';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Moon, Sun, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ChildrenManager } from './ChildrenManager';

export const Settings: React.FC = () => {
    const darkMode = useStore(state => state.settings.darkMode);
    const toggleDarkMode = useStore(state => state.toggleDarkMode);
    const currentUser = useStore(state => state.currentUser);
    const navigate = useNavigate();

    const handleBack = () => {
        if (currentUser?.role === 'parent') {
            navigate('/parent');
        } else {
            navigate('/child');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 p-6 transition-colors duration-300">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={handleBack}
                        className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm"
                    >
                        <ArrowLeft size={20} className="text-slate-600 dark:text-slate-300" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">Ajustes</h1>
                        <p className="text-sm text-slate-400 dark:text-slate-500">Personaliza la aplicación</p>
                    </div>
                </div>

                {/* Settings Sections */}
                <div className="space-y-6">
                    {/* Appearance Section */}
                    <div>
                        <h2 className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 px-1">Apariencia</h2>
                        <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 transition-colors duration-300">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center transition-colors duration-300">
                                        {darkMode ? (
                                            <Moon size={24} className="text-indigo-500" />
                                        ) : (
                                            <Sun size={24} className="text-amber-500" />
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-800 dark:text-white">Modo Oscuro</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">
                                            {darkMode ? 'Desactivar para tema claro' : 'Activar para tema oscuro'}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={toggleDarkMode}
                                    className={`relative w-16 h-8 rounded-full transition-all duration-300 ${darkMode
                                        ? 'bg-indigo-500 shadow-lg shadow-indigo-500/30'
                                        : 'bg-slate-200 dark:bg-slate-600'
                                        }`}
                                >
                                    <div
                                        className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-all duration-300 shadow-md ${darkMode ? 'translate-x-8' : 'translate-x-0'
                                            }`}
                                    />
                                </button>
                            </div>
                        </Card>
                    </div>

                    {/* Children Management Section - Only for Parents */}
                    {currentUser?.role === 'parent' && (
                        <div>
                            <h2 className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 px-1">Gestión de Hijos</h2>
                            <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 transition-colors duration-300">
                                <ChildrenManager />
                            </Card>
                        </div>
                    )}

                    {/* Info Section */}
                    <div>
                        <h2 className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 px-1">Información</h2>
                        <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 transition-colors duration-300">
                            <div className="space-y-3">
                                <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-700">
                                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Usuario actual</span>
                                    <span className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                        <span>{currentUser?.avatar}</span>
                                        {currentUser?.name}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-700">
                                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Rol</span>
                                    <span className="text-sm font-bold text-slate-800 dark:text-white capitalize">{currentUser?.role}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Versión</span>
                                    <span className="text-sm font-bold text-slate-800 dark:text-white">1.0.0</span>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>

                {/* Back Button */}
                <div className="mt-8">
                    <Button
                        onClick={handleBack}
                        variant="primary"
                        size="lg"
                        fullWidth
                        className="shadow-lg shadow-primary/20 dark:shadow-primary/10"
                    >
                        Volver al tablero
                    </Button>
                </div>
            </div>
        </div>
    );
};
