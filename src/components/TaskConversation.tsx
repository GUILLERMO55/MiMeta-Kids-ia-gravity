import React from 'react';
import type { TaskMessage } from '../types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Card } from './ui/Card';

interface TaskConversationProps {
    messages: TaskMessage[];
    currentUserRole: 'parent' | 'child';
}

export const TaskConversation: React.FC<TaskConversationProps> = ({ messages, currentUserRole }) => {
    if (!messages || messages.length === 0) {
        return null;
    }

    return (
        <div className="space-y-3 mt-4">
            <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Conversación
            </h4>
            <div className="space-y-2">
                {messages.map((msg) => {
                    const isCurrentUser = msg.from === currentUserRole;
                    const timestamp = new Date(msg.timestamp);

                    return (
                        <div key={msg.id} className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                            <Card
                                className={`max-w-[80%] ${isCurrentUser
                                        ? 'bg-primary dark:bg-primary/20 text-white dark:text-white border-primary'
                                        : 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-white border-slate-200 dark:border-slate-600'
                                    }`}
                                padding="sm"
                            >
                                <div className="space-y-1">
                                    <p className="text-xs font-bold opacity-70">
                                        {msg.from === 'parent' ? '👨‍👩‍👧 Padre/Madre' : '👧 Hijo/a'}
                                    </p>
                                    <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                                    <p className="text-[10px] opacity-60 text-right">
                                        {format(timestamp, "HH:mm · d 'de' MMM", { locale: es })}
                                    </p>
                                </div>
                            </Card>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
