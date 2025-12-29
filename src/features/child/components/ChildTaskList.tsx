import React, { useState } from 'react';
import { useStore } from '../../../store/useStore';
import type { ChildProfile, Task, TaskMessage } from '../../../types';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { isToday, parseISO, format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Clock, Calendar, MessageCircle } from 'lucide-react';
import { CountdownBadge } from '../../../hooks/useCountdown';
import { CompleteTaskModal } from './CompleteTaskModal';
import { TaskConversation } from '../../../components/TaskConversation';

export const ChildTaskList: React.FC<{ child: ChildProfile }> = ({ child }) => {
    const tasks = useStore(state => state.tasks);
    const completeTask = useStore(state => state.completeTask);
    const addTaskMessage = useStore(state => state.addTaskMessage);
    const [completingTaskId, setCompletingTaskId] = useState<string | null>(null);
    const [replyingToTaskId, setReplyingToTaskId] = useState<string | null>(null);
    const [replyMessage, setReplyMessage] = useState('');

    const myTasks = tasks.filter(t => t.assignedTo === child.id && isToday(parseISO(t.dueDate || new Date().toISOString())));

    const handleComplete = (taskId: string, proof: string, proofPhoto?: string, proofPhotoTimestamp?: string, fraudWarning?: boolean) => {
        completeTask(taskId, proof, proofPhoto, proofPhotoTimestamp, fraudWarning);
        setCompletingTaskId(null);
    };

    const handleReply = (taskId: string) => {
        if (!replyMessage.trim()) return;

        const newMessage: TaskMessage = {
            id: Date.now().toString(),
            from: 'child',
            message: replyMessage,
            timestamp: new Date().toISOString()
        };

        addTaskMessage(taskId, newMessage);
        setReplyMessage('');
        setReplyingToTaskId(null);
    };

    const TaskCard = ({ task }: { task: Task }) => {
        const isCompleted = task.status === 'completed';
        const isWaiting = task.status === 'waiting_approval';
        const isPending = task.status === 'pending';

        const moneyReward = task.rewards.find(r => r.type === 'money');
        const nonMoneyRewards = task.rewards.filter(r => r.type !== 'money');

        return (
            <Card className={`mb-4 border-l-8 ${isPending ? 'border-l-primary' : isWaiting ? 'border-l-amber-400 opacity-80' : 'border-l-green-500 opacity-60'} dark:bg-slate-800 dark:border-slate-700`}>
                <div className="flex justify-between items-start gap-3">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="font-bold text-lg text-gray-800 dark:text-white">{task.title}</h3>
                            {task.type === 'repetitive' && (
                                <span className="text-[10px] bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-md font-black border border-blue-100 dark:border-blue-800 shrink-0">🔄 DIARIA</span>
                            )}
                        </div>

                        {/* Date and Time Display */}
                        <div className="flex items-center flex-wrap gap-2 mb-3 text-sm">
                            {task.taskDate && (
                                <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                                    <Calendar size={14} className="text-slate-400 dark:text-slate-500" />
                                    <span className="font-semibold">
                                        {format(parseISO(task.taskDate), "EEEE, d 'de' MMMM", { locale: es })}
                                    </span>
                                </div>
                            )}
                            {task.taskTime && (
                                <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 rounded-lg border border-indigo-100 dark:border-indigo-800">
                                    <Clock size={14} className="text-indigo-400" />
                                    <span className="font-black text-sm">{task.taskTime}</span>
                                </div>
                            )}
                        </div>

                        {task.image && (
                            <div className="mt-2 rounded-xl overflow-hidden border border-gray-100 dark:border-slate-700 shadow-inner max-w-[200px]">
                                <img src={task.image} alt="Ejemplo" className="w-full h-24 object-cover" />
                            </div>
                        )}

                        {/* Non-monetary rewards */}
                        {nonMoneyRewards.length > 0 && (
                            <div className="flex gap-2 mt-2">
                                {nonMoneyRewards.map((r, i) => (
                                    <span key={i} className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 font-bold px-2 py-1 rounded-lg text-xs border border-purple-200 dark:border-purple-800">
                                        🎁 {r.value}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right side: Money reward at top with countdown below, then action button */}
                    <div className="flex flex-col items-end gap-2 shrink-0">
                        {moneyReward && (
                            <div className="flex flex-col items-end gap-1">
                                <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 leading-none">
                                    +{moneyReward.value}€
                                </div>
                                {/* Show countdown badge only for today's tasks */}
                                {task.taskDate && task.taskTime && isToday(parseISO(task.taskDate)) && (
                                    <CountdownBadge taskDate={task.taskDate} taskTime={task.taskTime} />
                                )}
                            </div>
                        )}
                        {isPending && (
                            <Button size="icon" className="w-12 h-12 rounded-full shadow-lg bg-gray-100 dark:bg-slate-700 hover:bg-green-100 dark:hover:bg-green-900/30 text-gray-400 dark:text-slate-400 hover:text-green-600 dark:hover:text-green-400 border-2 border-gray-200 dark:border-slate-600 hover:border-green-400 dark:hover:border-green-600" onClick={() => setCompletingTaskId(task.id)}>
                                ✓
                            </Button>
                        )}
                        {isWaiting && (
                            <div className="text-center">
                                <span className="text-xs font-bold text-amber-500 dark:text-amber-400 uppercase bg-amber-50 dark:bg-amber-900/30 px-2 py-1 rounded border border-amber-200 dark:border-amber-800 block mb-2">Revisando</span>
                                {task.needsResponse && (
                                    <Button
                                        size="sm"
                                        variant="primary"
                                        onClick={() => setReplyingToTaskId(task.id)}
                                        className="text-xs flex items-center gap-1"
                                    >
                                        <MessageCircle size={12} />
                                        Responder
                                    </Button>
                                )}
                            </div>
                        )}
                        {isCompleted && (
                            <span className="text-2xl">✅</span>
                        )}
                    </div>
                </div>

                {/* Conversation */}
                {task.conversation && task.conversation.length > 0 && (
                    <TaskConversation messages={task.conversation} currentUserRole="child" />
                )}

                {/* Reply Input */}
                {replyingToTaskId === task.id && (
                    <div className="mt-4 space-y-2">
                        <textarea
                            value={replyMessage}
                            onChange={(e) => setReplyMessage(e.target.value)}
                            placeholder="Escribe tu respuesta..."
                            className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-primary outline-none resize-none"
                            rows={3}
                            autoFocus
                        />
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    setReplyingToTaskId(null);
                                    setReplyMessage('');
                                }}
                                fullWidth
                            >
                                Cancelar
                            </Button>
                            <Button
                                variant="primary"
                                size="sm"
                                onClick={() => handleReply(task.id)}
                                fullWidth
                            >
                                Enviar
                            </Button>
                        </div>
                    </div>
                )}
            </Card>
        );
    };

    const completingTask = tasks.find(t => t.id === completingTaskId);

    return (
        <div>
            <h3 className="font-black text-gray-800 dark:text-white text-xl mb-4 pl-1">Tus Misiones de Hoy</h3>
            {myTasks.length === 0 && (
                <div className="text-center py-10 opacity-50">
                    <span className="text-4xl block mb-2">🎉</span>
                    <p className="dark:text-white">¡Todo limpio! No hay misiones pendientes.</p>
                </div>
            )}
            {myTasks.map(task => <TaskCard key={task.id} task={task} />)}

            {completingTask && (
                <CompleteTaskModal
                    isOpen={!!completingTaskId}
                    onClose={() => setCompletingTaskId(null)}
                    onComplete={(proof, photo, photoTimestamp, fraudWarning) => handleComplete(completingTaskId, proof, photo, photoTimestamp, fraudWarning)}
                    taskTitle={completingTask.title}
                />
            )}
        </div>
    );
};
