import React, { useState } from 'react';
import { useStore } from '../../../store/useStore';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import type { Task, TaskMessage } from '../../../types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { TaskConversation } from '../../../components/TaskConversation';
import {
    MessageCircle, Image as ImageIcon, AlertTriangle, Check, X, Star
} from 'lucide-react';

interface ReviewTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    taskId: string | null;
}

export const ReviewTaskModal: React.FC<ReviewTaskModalProps> = ({ isOpen, onClose, taskId }) => {
    const tasks = useStore(state => state.tasks);
    const users = useStore(state => state.users);
    const validateTask = useStore(state => state.validateTask);
    const requestClarification = useStore(state => state.requestClarification);

    const task = tasks.find(t => t.id === taskId);
    const [askingClarification, setAskingClarification] = useState(false);
    const [clarificationMessage, setClarificationMessage] = useState('');

    if (!task) return null;

    const getChildName = (id: string) => users.find(u => u.id === id)?.name || 'Hijo';
    const isBlocked = task.needsResponse;

    const handleSendClarification = () => {
        if (!clarificationMessage.trim()) return;
        requestClarification(task.id, clarificationMessage);
        setClarificationMessage('');
        setAskingClarification(false);
    };

    const handleApprove = () => {
        validateTask(task.id, true);
        onClose();
    };

    const handleReject = () => {
        validateTask(task.id, false);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Revisar Misión">
            <div className="space-y-6">
                {/* Header info */}
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-xl font-black text-slate-800 dark:text-white leading-tight">{task.title}</h2>
                        <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-wider">
                            Realizada por {getChildName(task.assignedTo)}
                        </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                        {task.fraudWarning && (
                            <span className="text-[10px] bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-2 py-1 rounded-md font-black uppercase tracking-wider flex items-center gap-1 border border-red-200 dark:border-red-800">
                                <AlertTriangle size={12} />
                                POSIBLE FRAUDE
                            </span>
                        )}
                    </div>
                </div>

                {/* Proof Content Group */}
                <div className="space-y-4">
                    {/* Text Proof */}
                    {task.proof && (
                        <div className="bg-amber-50/50 dark:bg-amber-900/10 p-4 rounded-2xl border border-amber-100 dark:border-amber-800/50">
                            <label className="text-[10px] font-black text-amber-600/70 uppercase mb-2 block tracking-widest">Lo que dice tu hijo:</label>
                            <p className="text-slate-700 dark:text-slate-300 font-medium italic">
                                "{task.proof}"
                            </p>
                        </div>
                    )}

                    {/* Photo Proof */}
                    {task.proofPhoto && (
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 px-1">
                                <ImageIcon size={14} className="text-slate-400" />
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Prueba fotográfica</span>
                            </div>
                            <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-lg">
                                <img src={task.proofPhoto} alt="Proof" className="w-full h-auto object-cover max-h-80" />
                                {task.fraudWarning && (
                                    <div className="absolute inset-x-0 bottom-0 bg-red-500/90 backdrop-blur-sm p-3 text-white">
                                        <div className="flex items-start gap-2">
                                            <AlertTriangle size={18} className="shrink-0 mt-0.5" />
                                            <div>
                                                <p className="text-xs font-bold leading-none mb-1">Cuidado: Foto antigua</p>
                                                <p className="text-[10px] opacity-90">Tomada el: {task.proofPhotoTimestamp ? format(new Date(task.proofPhotoTimestamp), "HH:mm · d 'de' MMM", { locale: es }) : 'Fecha desconocida'}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Conversation area */}
                <div className="border-t border-slate-100 dark:border-slate-800 pt-6">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 px-1">Conversación</h3>
                    {task.conversation && task.conversation.length > 0 ? (
                        <div className="max-h-48 overflow-y-auto mb-4 p-2">
                            <TaskConversation messages={task.conversation} currentUserRole="parent" />
                        </div>
                    ) : (
                        <p className="text-xs text-slate-400 text-center py-4 italic">No hay mensajes anteriores</p>
                    )}

                    {askingClarification ? (
                        <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-700 animate-in slide-in-from-bottom-2">
                            <textarea
                                value={clarificationMessage}
                                onChange={(e) => setClarificationMessage(e.target.value)}
                                placeholder="Escribe tu pregunta o duda..."
                                className="w-full bg-transparent border-none text-sm text-slate-800 dark:text-white placeholder:text-slate-400 focus:ring-0 resize-none min-h-[80px]"
                                autoFocus
                            />
                            <div className="flex gap-2 mt-2">
                                <Button size="sm" variant="outline" onClick={() => setAskingClarification(false)} fullWidth>Cancelar</Button>
                                <Button size="sm" variant="primary" onClick={handleSendClarification} fullWidth disabled={!clarificationMessage.trim()}>Enviar</Button>
                            </div>
                        </div>
                    ) : !isBlocked && (
                        <button
                            onClick={() => setAskingClarification(true)}
                            className="w-full py-3 px-4 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:border-slate-300 transition-all flex items-center justify-center gap-2 text-sm font-bold"
                        >
                            <MessageCircle size={18} />
                            Pedir aclaración
                        </button>
                    )}

                    {isBlocked && (
                        <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-xl border border-amber-100 dark:border-amber-800 text-center">
                            <p className="text-xs font-bold text-amber-600 dark:text-amber-400">Esperando respuesta del hijo...</p>
                        </div>
                    )}
                </div>

                {/* Main Actions */}
                <div className="flex gap-4 pt-4">
                    <Button
                        size="lg"
                        variant="danger"
                        className="flex-1 shadow-lg shadow-red-100 dark:shadow-none"
                        onClick={handleReject}
                    >
                        <X size={20} className="mr-2" />
                        Rechazar
                    </Button>
                    <Button
                        size="lg"
                        variant="primary"
                        className={`flex-1 shadow-lg ${isBlocked ? 'opacity-50 grayscale' : 'shadow-primary/20'}`}
                        onClick={handleApprove}
                        disabled={isBlocked}
                    >
                        <Check size={20} className="mr-2" />
                        {isBlocked ? 'Aclaración enviada' : 'Aprobar'}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};
