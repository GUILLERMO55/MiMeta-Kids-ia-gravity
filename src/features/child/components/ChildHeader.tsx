import React from 'react';
import type { ChildProfile } from '../../../types';
import { Card } from '../../../components/ui/Card';

export const ChildHeader: React.FC<{ child: ChildProfile }> = ({ child }) => {
    return (
        <Card className="bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white border-none rounded-b-3xl rounded-t-none shadow-lg -mx-5 -mt-5 pt-8 px-6 pb-6 mb-6">
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-4xl shadow-inner border-4 border-white/30">
                        {child.avatar}
                    </div>
                    <div>
                        <h2 className="font-extrabold text-xl">{child.name}</h2>
                        <div className="flex items-center gap-2">
                            <span className="bg-white/20 px-2 py-0.5 rounded-lg text-xs font-bold uppercase tracking-wider">Nivel {child.level}</span>
                            <span className="text-xs font-medium opacity-90">{child.xp}/100 XP</span>
                        </div>
                    </div>
                </div>

                <div className="text-right">
                    <div className="flex flex-col items-end">
                        <div className="flex items-center gap-1 text-amber-300 font-black text-lg drop-shadow-sm">
                            🔥 {child.streak} <span className="text-xs font-medium text-white/80">días</span>
                        </div>
                        <div className="text-3xl font-black mt-1">
                            {child.balance.toFixed(2)}€
                        </div>
                    </div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
                <div className="w-full bg-black/20 rounded-full h-2">
                    <div
                        className="bg-gradient-to-r from-amber-300 to-yellow-400 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(child.xp % 100)}%` }}
                    />
                </div>
                <p className="text-right text-[10px] uppercase font-bold text-white/60 mt-1">Siguiente nivel en {100 - (child.xp % 100)} XP</p>
            </div>
        </Card>
    );
};
