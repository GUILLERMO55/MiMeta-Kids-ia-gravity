import React from 'react';
import { useStore } from '../../../store/useStore';
import type { ChildProfile } from '../../../types';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';

export const ParentWallet: React.FC = () => {
    const users = useStore(state => state.users);
    const filterChildId = useStore(state => state.filterChildId);
    const children = (users.filter(u => u.role === 'child') as ChildProfile[]).filter(c =>
        filterChildId === null || c.id === filterChildId
    );
    const addReward = useStore(state => state.addRewardToChild);

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Monedero Familiar</h2>

            {children.map(child => (
                <Card key={child.id} className="bg-gradient-to-br from-primary to-indigo-600 text-white border-none">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                            <div className="text-3xl bg-white/20 w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-sm">
                                {child.avatar}
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">{child.name}</h3>
                                <p className="text-indigo-100 text-sm">Nivel {child.level} • {child.xp} XP</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-indigo-200 text-xs font-semibold uppercase">Saldo Actual</p>
                            <p className="text-3xl font-extrabold tracking-tight">{child.balance.toFixed(2)}€</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <Button className="bg-white/10 hover:bg-white/20 text-white border border-white/20" onClick={() => addReward(child.id, 1)}>
                            + Ingresar
                        </Button>
                        <Button className="bg-white text-primary hover:bg-gray-100" onClick={() => alert('Bizum link generated!')}>
                            Liberar Dinero
                        </Button>
                    </div>
                </Card>
            ))}

            <div className="mt-8">
                <h3 className="font-bold text-gray-800 mb-2">Movimientos Recientes</h3>
                <p className="text-gray-400 text-sm">No hay movimientos recientes.</p>
            </div>
        </div>
    );
};
