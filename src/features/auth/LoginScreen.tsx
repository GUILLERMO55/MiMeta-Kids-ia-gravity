import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { MobileLayout } from '../../layouts/MobileLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import type { User } from '../../types';

export const LoginScreen: React.FC = () => {
    const navigate = useNavigate();
    const { users, setCurrentUser } = useStore();

    const handleLogin = (user: User) => {
        setCurrentUser(user);
        if (user.role === 'parent') {
            navigate('/parent');
        } else {
            navigate('/child');
        }
    };

    return (
        <MobileLayout className="bg-primary/5 justify-center p-6">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-primary mb-2 tracking-tight">MiMeta Kids</h1>
                <p className="text-gray-500 font-medium">¡Transformando hábitos en superpoderes!</p>
            </div>

            <div className="space-y-4">
                <h2 className="text-lg font-bold text-gray-800 text-center mb-4">¿Quién eres?</h2>

                {users.map((user) => (
                    <Card
                        key={user.id}
                        className="cursor-pointer hover:border-primary transition-colors flex items-center gap-4 active:bg-gray-50"
                        onClick={() => handleLogin(user)}
                    >
                        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-3xl shrink-0">
                            {user.avatar}
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-lg text-gray-900">{user.name}</h3>
                            <p className="text-sm text-gray-500 capitalize">{user.role === 'parent' ? 'Padre / Gestor' : 'Héroe / Aventurero'}</p>
                        </div>
                        <div className="text-gray-300">
                            {/* Chevron or arrow */}
                            👉
                        </div>
                    </Card>
                ))}
            </div>

            <div className="mt-12 text-center">
                <Button variant="ghost" size="sm" className="text-gray-400">
                    ¿Problemas para entrar?
                </Button>
            </div>
        </MobileLayout>
    );
};
