import React from 'react';
import { useStore } from '../../../store/useStore';
import type { ChildProfile } from '../../../types';

export const ChildRewards: React.FC<{ child: ChildProfile }> = ({ child }) => {
    const redeemReward = useStore(state => state.redeemReward);

    const handleRedeem = (index: number, item: string) => {
        if (window.confirm(`¿Quieres canjear "${item}" ahora?`)) {
            redeemReward(child.id, index);
            alert(`¡Has canjeado ${item}! ¡Disfrútalo!`);
        }
    };

    return (
        <div className="pt-4">
            <h3 className="font-black text-gray-800 text-xl mb-4 pl-1">Tus Regalos y Premios</h3>

            <div className="space-y-3">
                {child.inventory.length === 0 ? (
                    <div className="bg-white/50 border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center">
                        <span className="text-4xl block mb-2">🎁</span>
                        <p className="text-gray-400 text-sm font-medium">Aún no tienes objetos en tu inventario.<br />¡Completa misiones para ganar premios!</p>
                    </div>
                ) : (
                    child.inventory.map((item, i) => (
                        <div key={i} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between group animate-in slide-in-from-bottom-2 duration-300" style={{ animationDelay: `${i * 50}ms` }}>
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-2xl shadow-inner">
                                    🎁
                                </div>
                                <div>
                                    <span className="font-black text-gray-800 block leading-tight">{item}</span>
                                    <span className="text-[10px] uppercase font-bold text-amber-500 tracking-wider">¡Listo para usar!</span>
                                </div>
                            </div>
                            <button
                                onClick={() => handleRedeem(i, item)}
                                className="bg-primary text-white px-4 py-2 rounded-xl font-bold text-xs shadow-md shadow-primary/20 hover:shadow-primary/40 active:scale-95 transition-all"
                            >
                                ¡Canjear!
                            </button>
                        </div>
                    ))
                )}
            </div>

            <div className="mt-8 bg-indigo-600 rounded-3xl p-6 text-white shadow-xl shadow-indigo-200 relative overflow-hidden">
                <div className="relative z-10">
                    <h4 className="font-black text-lg mb-1">¿Cómo ganar más?</h4>
                    <p className="text-indigo-100 text-xs leading-relaxed opacity-90">Completa las misiones que te asigne papá o mamá. ¡Algunas tienen premios especiales por rachas!</p>
                </div>
                <div className="absolute -right-4 -bottom-4 text-8xl opacity-10 rotate-12">🏆</div>
            </div>
        </div>
    );
};
