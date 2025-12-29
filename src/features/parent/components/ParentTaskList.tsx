import React, { useState } from 'react';
import { useStore } from '../../../store/useStore';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import type { Task, TaskMessage } from '../../../types';
import { CreateTaskModal } from './CreateTaskModal';
import { format, addDays, getDay, parseISO, isSameDay, isToday } from 'date-fns';
import { es } from 'date-fns/locale';
import { CountdownBadge } from '../../../hooks/useCountdown';
import { TaskConversation } from '../../../components/TaskConversation';
import {
    Dog, Bed, Check, Book, Utensils, Dumbbell, Plus, Gamepad2, Star,
    Sun, AlertCircle, Mountain, Home, ShoppingBag, X, GraduationCap,
    Users, User, UserCircle, Calculator, Music, PlusCircle, Bike,
    Trophy, Calendar, Clock, MessageCircle, Image as ImageIcon, AlertTriangle, Eye
} from 'lucide-react';
import { ReviewTaskModal } from './ReviewTaskModal';

const ICONS_MAP: Record<string, any> = {
    Dog, Bed, Check, Book, Utensils, Dumbbell, Plus, Gamepad2, Star,
    Sun, AlertCircle, Mountain, Home, ShoppingBag, X, GraduationCap,
    Users, User, UserCircle, Calculator, Music, PlusCircle, Bike,
    Trophy
};

export const ParentTaskList: React.FC = () => {
    const tasks = useStore(state => state.tasks);
    const users = useStore(state => state.users);
    const validateTask = useStore(state => state.validateTask);
    const requestClarification = useStore(state => state.requestClarification);
    const addTaskMessage = useStore(state => state.addTaskMessage);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [reviewingTaskId, setReviewingTaskId] = useState<string | null>(null);
    const filterChildId = useStore(state => state.filterChildId);

    const getChildName = (id: string) => users.find(u => u.id === id)?.name || 'Hijo';

    const handleCreate = () => {
        // No longer handled here, but if something calls it from within...
    };

    const handleEdit = (task: Task) => {
        if (task.status === 'waiting_approval') {
            setReviewingTaskId(task.id);
            return;
        }
        setEditingTask(task);
        // We might need to find a way to open the modal from here if editing is still desired 
        // through ParentDashboard, but for now we focus on the removal of the header as requested.
        // Actually, editing is still needed. Let's keep a way to handle it or lift editing state too.
    };

    const pendingValidation = tasks.filter(t =>
        t.status === 'waiting_approval' && (filterChildId === null || t.assignedTo === filterChildId)
    );
    const activeTasks = tasks.filter(t =>
        t.status !== 'waiting_approval' && (filterChildId === null || t.assignedTo === filterChildId)
    );

    const getGroupedTasks = () => {
        const groups: { title: string; subtitle?: string; tasks: Task[]; displayDate: string }[] = [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // 1. Next 7 days
        for (let i = 0; i < 7; i++) {
            const targetDate = addDays(today, i);
            const dateStr = format(targetDate, 'yyyy-MM-dd');
            const dayOfWeek = (getDay(targetDate) + 6) % 7; // Map 1->0 (Mon), 0->6 (Sun)

            let title = "";
            const dayName = format(targetDate, 'EEEE', { locale: es });
            const capitalizedDayName = dayName.charAt(0).toUpperCase() + dayName.slice(1);

            if (i === 0) title = `Hoy (${capitalizedDayName})`;
            else if (i === 1) title = `Mañana (${capitalizedDayName})`;
            else title = capitalizedDayName;

            const dayTasks = activeTasks.filter(t => {
                if (t.type === 'repetitive' || (t.selectedDays && t.selectedDays.length > 0)) {
                    return t.selectedDays?.includes(dayOfWeek);
                } else {
                    return t.taskDate === dateStr;
                }
            });

            if (dayTasks.length > 0) {
                groups.push({
                    title,
                    subtitle: format(targetDate, "d 'de' MMMM", { locale: es }),
                    tasks: dayTasks,
                    displayDate: dateStr // Add the target date for this group
                });
            }
        }

        // 2. Future unique tasks (> 1 week)
        const oneWeekLater = addDays(today, 7);
        const futureTasks = activeTasks.filter(t => {
            // Repetitive tasks already shown in the weekly view (loop above)
            // if we show them again here, it might be redundant, but unique tasks definitely go here.
            if ((!t.selectedDays || t.selectedDays.length === 0) && t.taskDate) {
                const tDate = parseISO(t.taskDate);
                return tDate >= oneWeekLater;
            }
            return false;
        });

        if (futureTasks.length > 0) {
            futureTasks.sort((a, b) => (a.taskDate || '').localeCompare(b.taskDate || ''));
            groups.push({
                title: "Próximas misiones",
                subtitle: "A partir de la próxima semana",
                tasks: futureTasks,
                displayDate: futureTasks[0]?.taskDate || format(oneWeekLater, 'yyyy-MM-dd')
            });
        }

        return groups;
    };

    const TaskItem = ({ task, displayDate }: { task: Task; displayDate: string }) => {
        const moneyReward = task.rewards.find(r => r.type === 'money');
        const nonMoneyRewards = task.rewards.filter(r => r.type !== 'money');

        return (
            <Card className="mb-3 cursor-pointer hover:border-primary/50 transition-all hover:shadow-md bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700" padding="sm" onClick={() => handleEdit(task)}>
                <div className="flex justify-between items-start gap-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-50 text-indigo-500 shadow-sm border border-indigo-100/50 shrink-0">
                            {(() => {
                                const Icon = task.icon && ICONS_MAP[task.icon] ? ICONS_MAP[task.icon] : Star;
                                return <Icon size={20} />;
                            })()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <span className={`font-bold truncate ${task.status === 'completed' ? 'text-slate-400 line-through' : 'text-slate-800 dark:text-white'}`}>
                                    {task.title}
                                </span>
                                {task.isUrgent && (
                                    <span className="bg-red-50 text-red-500 text-[10px] px-1.5 py-0.5 rounded-md font-black uppercase tracking-tighter border border-red-100 shrink-0">¡Urgente!</span>
                                )}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500 font-medium mt-0.5">
                                <span className="flex items-center gap-1">
                                    <UserCircle size={12} className="text-slate-300 dark:text-slate-600" />
                                    {getChildName(task.assignedTo)}
                                </span>
                                {task.taskTime && (
                                    <span className="flex items-center gap-1 ml-1">
                                        <Clock size={12} className="text-slate-300 dark:text-slate-600" />
                                        {task.taskTime}
                                        {task.type === 'repetitive' && <span className="text-[10px] bg-slate-100 dark:bg-slate-700 px-1 rounded">🔄</span>}
                                    </span>
                                )}
                            </div>
                            {/* Non-monetary rewards below */}
                            {nonMoneyRewards.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 mt-2">
                                    {nonMoneyRewards.map((r, i) => (
                                        <span key={i} className="text-[10px] font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30 px-2 py-0.5 rounded-lg border border-purple-100 dark:border-purple-800 flex items-center gap-1">
                                            🎁 {r.value}
                                        </span>
                                    ))}
                                    {task.image && (
                                        <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-lg border border-blue-100 dark:border-blue-800 flex items-center gap-1">
                                            🖼️ Con foto
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Monetary reward and countdown at top-right */}
                    <div className="flex flex-col items-end gap-2 shrink-0">
                        {moneyReward && (
                            <div className="text-right flex flex-col items-end gap-1">
                                <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 leading-none">
                                    +{Number(moneyReward.value).toFixed(2)}€
                                </div>
                                {/* Show countdown badge only for today's instance of the task */}
                                {task.taskTime && displayDate && isToday(parseISO(displayDate)) && (
                                    <CountdownBadge taskDate={displayDate} taskTime={task.taskTime} />
                                )}
                            </div>
                        )}
                        {task.status === 'completed' && (
                            <div className="w-8 h-8 rounded-full bg-green-50 dark:bg-green-900/30 flex items-center justify-center text-green-500 dark:text-green-400 border border-green-100 dark:border-green-800">
                                <Check size={18} />
                            </div>
                        )}
                        {task.status === 'waiting_approval' && (
                            <div className="flex flex-col items-end">
                                <span className="text-[10px] font-black text-amber-500 bg-amber-50 dark:bg-amber-900/30 px-2 py-1 rounded-md border border-amber-100 dark:border-amber-800">
                                    REVISIÓN
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </Card>
        );
    };

    const ReviewSummaryItem = ({ task }: { task: Task }) => {
        return (
            <Card
                className={`mb-3 cursor-pointer border-l-4 ${task.fraudWarning ? 'border-l-red-500' : 'border-l-amber-400'} hover:shadow-md transition-all dark:bg-slate-800`}
                padding="sm"
                onClick={() => setReviewingTaskId(task.id)}
            >
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm border ${task.fraudWarning ? 'bg-red-50 text-red-500 border-red-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                            {task.fraudWarning ? <AlertTriangle size={20} /> : <Eye size={20} />}
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800 dark:text-white leading-tight">{task.title}</h3>
                            <div className="flex items-center gap-2 mt-0.5">
                                <span className={`text-[10px] font-black uppercase tracking-wider ${task.fraudWarning ? 'text-red-500' : 'text-amber-600'}`}>
                                    {task.fraudWarning ? '⚠️ ¡Revisar Fraude!' : 'Para revisar'}
                                </span>
                                {task.needsResponse && (
                                    <span className="text-[10px] bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-1.5 py-0.5 rounded font-bold border border-blue-100 dark:border-blue-800">
                                        Esperando respuesta
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="text-xs font-bold text-slate-400">{getChildName(task.assignedTo)}</span>
                        {task.taskTime && <span className="text-[10px] text-slate-300 font-medium">{task.taskTime}</span>}
                    </div>
                </div>
            </Card>
        );
    };

    const groupedTasks = getGroupedTasks();

    return (
        <div className="space-y-8 pb-24 pt-4">
            {pendingValidation.length > 0 && (
                <section className="animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                        <h3 className="text-sm font-black text-amber-600 uppercase tracking-widest">Pendientes de Aprobación</h3>
                    </div>
                    {pendingValidation.map(task => <ReviewSummaryItem key={task.id} task={task} />)}
                </section>
            )}

            <div className="space-y-10">
                {groupedTasks.length === 0 ? (
                    <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                            <Calendar size={32} className="text-slate-300" />
                        </div>
                        <h4 className="font-bold text-slate-400">No hay misiones activas</h4>
                        <p className="text-xs text-slate-300">¡Crea una misión para empezar!</p>
                    </div>
                ) : (
                    groupedTasks.map((group, idx) => (
                        <section key={idx} className="animate-in fade-in slide-in-from-left-4 duration-500" style={{ animationDelay: `${idx * 100}ms` }}>
                            <div className="flex items-end justify-between mb-4 px-1">
                                <div>
                                    <h3 className={`text-xl font-black tracking-tight ${idx === 0 ? 'text-indigo-600' : 'text-slate-700'}`}>
                                        {group.title}
                                    </h3>
                                    {group.subtitle && <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{group.subtitle}</p>}
                                </div>
                                <div className="h-px flex-1 bg-slate-100 mx-4 mb-2 opacity-50" />
                                <span className="text-[10px] font-black text-slate-300 bg-slate-50 px-2 py-1 rounded-md">{group.tasks.length} {group.tasks.length === 1 ? 'tarea' : 'tareas'}</span>
                            </div>
                            <div className="space-y-1">
                                {group.tasks.map(task => (
                                    <TaskItem key={`${group.title}-${task.id}`} task={task} displayDate={group.displayDate} />
                                ))}
                            </div>
                        </section>
                    ))
                )}
            </div>

            <ReviewTaskModal
                isOpen={!!reviewingTaskId}
                onClose={() => setReviewingTaskId(null)}
                taskId={reviewingTaskId}
            />
            {/* If we want to allow editing, we should lift editingTask to ParentDashboard too */}
            {/* But the request specifically talked about the "Add Task" button relocation */}
            {editingTask && (
                <CreateTaskModal
                    isOpen={!!editingTask}
                    onClose={() => setEditingTask(null)}
                    taskToEdit={editingTask}
                />
            )}
        </div>
    );
};
