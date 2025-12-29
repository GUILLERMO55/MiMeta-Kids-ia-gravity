import React from 'react';
// import { MobileLayout } from '../../layouts/MobileLayout';
import { Card } from '../../components/ui/Card';
import { useStore } from '../../store/useStore';

export const FinancialEducation: React.FC = () => {
    const mode = useStore(state => state.settings.childMode);

    return (
        <div className="p-4 space-y-4">
            <h2 className="text-2xl font-black text-gray-800">Escuela de Dinero 🎓</h2>

            {mode === 'under12' ? (
                <div className="space-y-4">
                    <Card className="bg-blue-50 border-blue-100">
                        <h3 className="font-bold text-lg text-blue-800 mb-2">¿Qué es el Ahorro?</h3>
                        <p className="text-sm text-blue-600">El ahorro es guardar dinero hoy para comprar algo mejor mañana. ¡Como guardar energía para el recreo!</p>
                        <div className="mt-3 text-4xl text-center">🐷💰</div>
                    </Card>
                    <Card className="bg-green-50 border-green-100">
                        <h3 className="font-bold text-lg text-green-800 mb-2">Gana tu propio dinero</h3>
                        <p className="text-sm text-green-600">El dinero se consigue ayudando y cumpliendo misiones. ¡Tú esfuerzo tiene valor!</p>
                    </Card>
                </div>
            ) : (
                <div className="space-y-4">
                    <Card className="bg-slate-50 border-slate-200">
                        <h3 className="font-bold text-lg text-slate-800 mb-2">Interés Compuesto</h3>
                        <p className="text-sm text-slate-600">Es cuando tu dinero genera más dinero. Si ahorras 10€ y te dan un 10% de interés, ¡tendrás 11€ sin hacer nada!</p>
                    </Card>
                    <Card className="bg-purple-50 border-purple-100">
                        <h3 className="font-bold text-lg text-purple-800 mb-2">Presupuesto 50/30/20</h3>
                        <p className="text-sm text-purple-600">Una regla de oro: 50% necesidades, 30% caprichos, 20% ahorro. ¿Cumples tu porcentaje?</p>
                    </Card>
                </div>
            )}
        </div>
    );
};
