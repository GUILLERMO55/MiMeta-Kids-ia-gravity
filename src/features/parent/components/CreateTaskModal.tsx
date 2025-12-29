import React, { useState } from 'react';
import { useStore } from '../../../store/useStore';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import type { Task } from '../../../types';
import {
    Dog, Bed, Check, Book, Utensils, Dumbbell, Plus, Gamepad2, Star,
    Sun, AlertCircle, Mountain, Home, ShoppingBag, X, GraduationCap,
    Users, User, UserCircle, Calculator, Music, PlusCircle, Bike,
    Trophy, ChevronDown, Camera, Image as ImageIcon
} from 'lucide-react';

interface CreateTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    taskToEdit?: Task | null;
}

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({ isOpen, onClose, taskToEdit }) => {
    const addTask = useStore(state => state.addTask);
    const updateTask = useStore(state => state.updateTask);
    const users = useStore(state => state.users);
    const currentUser = useStore(state => state.currentUser);

    // Form State
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [assignedTo, setAssignedTo] = useState('');
    const [isUrgent, setIsUrgent] = useState(false);
    const [rewardType, setRewardType] = useState<'money' | 'custom'>('money');
    const [rewardAmount, setRewardAmount] = useState('1');
    const [customReward, setCustomReward] = useState('');

    // Streak State
    const [streakEnabled, setStreakEnabled] = useState(false);
    const [streakBonus, setStreakBonus] = useState('0.00');
    const [streakCustomReward, setStreakCustomReward] = useState('');
    const [streakDays, setStreakDays] = useState('2');

    // Icon State
    const [selectedIcon, setSelectedIcon] = useState('Star');
    const [taskImage, setTaskImage] = useState<string | null>(null);
    const [isIconPickerOpen, setIsIconPickerOpen] = useState(false);
    const [isChildPickerOpen, setIsChildPickerOpen] = useState(false);
    const [repeatEnabled, setRepeatEnabled] = useState(false);

    const ICONS = [
        { name: 'Dog', icon: Dog }, { name: 'Bed', icon: Bed }, { name: 'Check', icon: Check },
        { name: 'Book', icon: Book }, { name: 'Utensils', icon: Utensils }, { name: 'Dumbbell', icon: Dumbbell },
        { name: 'Plus', icon: Plus }, { name: 'Gamepad2', icon: Gamepad2 }, { name: 'Star', icon: Star },
        { name: 'Sun', icon: Sun }, { name: 'AlertCircle', icon: AlertCircle }, { name: 'Mountain', icon: Mountain },
        { name: 'Home', icon: Home }, { name: 'ShoppingBag', icon: ShoppingBag }, { name: 'GraduationCap', icon: GraduationCap },
        { name: 'Users', icon: Users }, { name: 'User', icon: User }, { name: 'UserCircle', icon: UserCircle },
        { name: 'Music', icon: Music }, { name: 'Bike', icon: Bike }, { name: 'Trophy', icon: Trophy }
    ];

    // Helper to get local date in YYYY-MM-DD format
    const getLocalDateString = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // Schedule State
    const [date, setDate] = useState(() => getLocalDateString());
    const [hour, setHour] = useState(22);
    const [minute, setMinute] = useState(30);
    const [selectedDays, setSelectedDays] = useState<number[]>([]);

    React.useEffect(() => {
        if (isOpen) {
            if (taskToEdit) {
                setTitle(taskToEdit.title);
                setDescription(taskToEdit.description || '');
                setAssignedTo(taskToEdit.assignedTo);
                setIsUrgent(taskToEdit.isUrgent);

                // Schedule Init
                if (taskToEdit.taskDate) setDate(taskToEdit.taskDate);
                else if (taskToEdit.dueDate) setDate(taskToEdit.dueDate.split('T')[0]);

                if (taskToEdit.taskTime) {
                    const [h, m] = taskToEdit.taskTime.split(':').map(Number);
                    setHour(h);
                    setMinute(m);
                }

                if (taskToEdit.selectedDays) setSelectedDays(taskToEdit.selectedDays);
                else setSelectedDays([]);

                if (taskToEdit.selectedDays) setSelectedDays(taskToEdit.selectedDays);
                else setSelectedDays([]);

                // Streak Init
                setStreakEnabled(!!taskToEdit.streakEnabled);
                setStreakBonus(taskToEdit.streakBonus ? String(taskToEdit.streakBonus) : '0.00');
                setStreakCustomReward(taskToEdit.streakCustomReward || '');
                setStreakDays(taskToEdit.streakDays ? String(taskToEdit.streakDays) : '2');
                setSelectedIcon(taskToEdit.icon || 'Star');
                setTaskImage(taskToEdit.image || null);

                // Fallback to legacy rewards array logic
                const moneyReward = taskToEdit.rewards.find(r => r.type === 'money');
                const customRewardObj = taskToEdit.rewards.find(r => r.type === 'custom');

                if (moneyReward) {
                    setRewardType('money');
                    setRewardAmount(String(moneyReward.value));
                    setCustomReward('');
                } else if (customRewardObj) {
                    setRewardType('custom');
                    setCustomReward(String(customRewardObj.value));
                    setRewardAmount('1');
                } else {
                    setRewardType('money');
                    setRewardAmount('1');
                }
            } else {
                setTitle('');
                setDescription('');
                setAssignedTo(users.find(u => u.role === 'child')?.id || '');
                setIsUrgent(false);
                setRewardType('money');
                setRewardAmount('1');
                setCustomReward('');

                // Reset Schedule
                setDate(getLocalDateString());
                setHour(22);
                setMinute(30);
                setSelectedDays([]);

                // Reset Streak
                setStreakEnabled(false);
                setStreakEnabled(false);
                setStreakBonus('0.00');
                setStreakCustomReward('');
                setStreakDays('2');
                setSelectedIcon('Star');
                setTaskImage(null);
                setRepeatEnabled(false);
            }
        }
    }, [isOpen, taskToEdit, users]);

    React.useEffect(() => {
        if (isOpen && taskToEdit) {
            setRepeatEnabled(taskToEdit.selectedDays ? taskToEdit.selectedDays.length > 0 : false);
        }
    }, [isOpen, taskToEdit]);

    // Schedule Handlers
    const adjustTime = (type: 'hour' | 'minute', amount: number) => {
        if (type === 'hour') {
            setHour(prev => {
                const newHour = prev + amount;
                if (newHour > 23) return 0;
                if (newHour < 0) return 23;
                return newHour;
            });
        } else {
            setMinute(prev => {
                let newMin = prev + amount;
                if (newMin >= 60) {
                    setHour(h => (h + 1) > 23 ? 0 : h + 1);
                    return newMin - 60;
                }
                if (newMin < 0) {
                    setHour(h => (h - 1) < 0 ? 23 : h - 1);
                    return newMin + 60;
                }
                return newMin;
            });
        }
    };

    const toggleDay = (dayIndex: number) => {
        setSelectedDays(prev =>
            prev.includes(dayIndex)
                ? prev.filter(d => d !== dayIndex)
                : [...prev, dayIndex].sort()
        );
    };

    const selectWeekDays = () => setSelectedDays([0, 1, 2, 3, 4]); // L-V
    const selectAllDays = () => setSelectedDays([0, 1, 2, 3, 4, 5, 6]); // L-D
    const setTimeIn30Mins = () => {
        const now = new Date();
        now.setMinutes(now.getMinutes() + 30);
        setHour(now.getHours());
        setMinute(now.getMinutes());
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setTaskImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !assignedTo) return;

        const rewards = [];
        if (rewardType === 'money') {
            rewards.push({ type: 'money' as const, value: Number(rewardAmount) });
        } else {
            if (!customReward.trim()) return; // Validation for custom reward
            rewards.push({ type: 'custom' as const, value: customReward });
        }

        const commonTaskData = {
            title,
            description,
            isUrgent,
            rewards,
            taskDate: date,
            taskTime: `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`,
            selectedDays,
            streakEnabled,
            streakBonus: streakEnabled ? Number(streakBonus) : 0,
            streakCustomReward: streakEnabled ? streakCustomReward : undefined,
            streakDays: streakEnabled ? Number(streakDays) : 0,
            icon: selectedIcon,
            image: taskImage || undefined,
            dueDate: `${date}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00.000Z`, // ISO-ish for legacy compat
        };

        if (taskToEdit) {
            const taskData: Partial<Task> = {
                ...commonTaskData,
                assignedTo,
            };
            updateTask(taskToEdit.id, taskData);
        } else {
            if (assignedTo === 'all') {
                // Create a task for each child
                childrenUsers.forEach(child => {
                    const newTask: Task = {
                        id: crypto.randomUUID(),
                        assignedTo: child.id,
                        createdBy: currentUser?.id || 'parent',
                        status: 'pending',
                        type: selectedDays.length > 0 ? 'repetitive' : 'unique',
                        ...commonTaskData,
                    };
                    addTask(newTask);
                });
            } else {
                const newTask: Task = {
                    id: crypto.randomUUID(),
                    assignedTo,
                    createdBy: currentUser?.id || 'parent',
                    status: 'pending',
                    type: selectedDays.length > 0 ? 'repetitive' : 'unique',
                    ...commonTaskData,
                };
                addTask(newTask);
            }
        }

        // Reset Form
        setTitle('');
        setDescription('');
        setIsUrgent(false);
        setRewardAmount('1');
        setRewardAmount('1');
        setCustomReward('');
        setStreakCustomReward('');
        setTaskImage(null);
        onClose();
    };

    const childrenUsers = users.filter(u => u.role === 'child');
    const currentAssignedChild = childrenUsers.find(c => c.id === assignedTo);

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={taskToEdit ? "Editar Misión" : "Nueva Misión"}>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-6">
                    {/* Name & Details Group */}
                    <div className="bg-slate-100 p-4 rounded-xl border border-slate-200 space-y-4 shadow-sm">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">Nombre de la tarea</label>
                            <Input
                                placeholder="Ej: Pasear al perro"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="bg-white border-border"
                            />
                        </div>

                        <div className="space-y-1">
                            <textarea
                                placeholder="Añade detalles sobre la tarea... (opcional)"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full p-3 rounded-xl border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm min-h-[80px] resize-none text-slate-700 placeholder:text-slate-400"
                            />
                        </div>

                        {/* Photo Attachment Section */}
                        <div className="space-y-2 pt-2 border-t border-slate-200/50">
                            <label className="text-[10px] font-black text-slate-400 mb-1 block ml-1 uppercase tracking-tighter">Ejemplo visual (opcional)</label>
                            <div className="flex gap-3">
                                {!taskImage ? (
                                    <label className="flex-1 cursor-pointer">
                                        <div className="w-full h-[60px] bg-white border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center gap-2 text-slate-400 hover:bg-slate-50 hover:border-slate-300 transition-all">
                                            <Camera size={18} />
                                            <span className="text-xs font-bold">Adjuntar foto de ejemplo</span>
                                        </div>
                                        <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                    </label>
                                ) : (
                                    <div className="relative w-full h-[100px] group">
                                        <img src={taskImage} alt="Preview" className="w-full h-full object-cover rounded-xl border border-slate-200" />
                                        <button
                                            type="button"
                                            onClick={() => setTaskImage(null)}
                                            className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors"
                                        >
                                            <X size={12} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Schedule Section */}
                    <div className="bg-sky/70 p-4 rounded-xl border border-sky/80 space-y-4 shadow-sm">
                        <div className="flex justify-between items-center">
                            <h3 className="text-sm font-bold text-blue-700 uppercase">FECHA Y HORA LÍMITE</h3>
                            <button
                                type="button"
                                onClick={setTimeIn30Mins}
                                className="px-3 py-1.5 bg-white border border-blue-100 text-blue-600 rounded-lg text-xs font-bold shadow-sm hover:bg-blue-50 transition-colors"
                            >
                                ¡En 30 minutos!
                            </button>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-1 space-y-1">
                                <label className="text-xs font-semibold text-blue-600/70">Fecha</label>
                                <div className="relative">
                                    <input
                                        type="date"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        className="w-full p-3 rounded-xl border border-blue-100 bg-white shadow-sm font-bold text-slate-700 focus:ring-2 focus:ring-blue-200 outline-none"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-blue-600/70">Hora límite</label>
                                <div className="bg-white p-1.5 rounded-xl border border-blue-100 flex items-center gap-2 shadow-sm">
                                    {/* Hours */}
                                    <div className="flex items-center gap-1 bg-slate-50 rounded-lg px-1">
                                        <button type="button" onClick={() => adjustTime('hour', -1)} className="w-6 h-6 flex items-center justify-center text-blue-400 hover:bg-blue-100 rounded-md font-bold transition-colors">-</button>
                                        <span className="w-6 text-center font-black text-slate-700">{String(hour).padStart(2, '0')}</span>
                                        <button type="button" onClick={() => adjustTime('hour', 1)} className="w-6 h-6 flex items-center justify-center text-blue-400 hover:bg-blue-100 rounded-md font-bold transition-colors">+</button>
                                    </div>
                                    <span className="font-bold text-blue-300">:</span>
                                    {/* Minutes */}
                                    <div className="flex items-center gap-1 bg-slate-50 rounded-lg px-1">
                                        <button type="button" onClick={() => adjustTime('minute', -15)} className="w-6 h-6 flex items-center justify-center text-blue-400 hover:bg-blue-100 rounded-md font-bold transition-colors">-</button>
                                        <span className="w-6 text-center font-black text-slate-700">{String(minute).padStart(2, '0')}</span>
                                        <button type="button" onClick={() => adjustTime('minute', 15)} className="w-6 h-6 flex items-center justify-center text-blue-400 hover:bg-blue-100 rounded-md font-bold transition-colors">+</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-2 border-t border-blue-100/50">
                            <button
                                type="button"
                                onClick={() => {
                                    const newVal = !repeatEnabled;
                                    setRepeatEnabled(newVal);
                                    if (!newVal) setSelectedDays([]);
                                }}
                                className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${repeatEnabled
                                    ? 'bg-blue-500 text-white shadow-md shadow-blue-200'
                                    : 'bg-white border border-blue-100 text-blue-500 hover:bg-blue-50'
                                    }`}
                            >
                                <span>{repeatEnabled ? '🔄 Repetición Activa' : '➕ Repetir tarea'}</span>
                            </button>
                        </div>

                        {repeatEnabled && (
                            <div className="space-y-3 pt-2 animate-in slide-in-from-top-2 duration-200">
                                <div className="flex justify-between items-end px-1">
                                    <label className="text-[10px] font-black text-blue-600/70 uppercase">Días de la semana</label>
                                    <div className="flex gap-2">
                                        <button type="button" onClick={selectWeekDays} className="px-2 py-0.5 bg-white border border-blue-100 text-[10px] font-bold text-blue-500 rounded-lg hover:bg-blue-50">L-V</button>
                                        <button type="button" onClick={selectAllDays} className="px-2 py-0.5 bg-white border border-blue-100 text-[10px] font-bold text-blue-500 rounded-lg hover:bg-blue-50">L-D</button>
                                    </div>
                                </div>
                                <div className="flex justify-between gap-1">
                                    {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((day, index) => (
                                        <button
                                            key={day}
                                            type="button"
                                            onClick={() => toggleDay(index)}
                                            className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs transition-all ${selectedDays.includes(index)
                                                ? 'bg-blue-500 text-white shadow-md shadow-blue-500/30 transform scale-105'
                                                : 'bg-white border border-blue-100 text-blue-300 hover:border-blue-300 hover:text-blue-500'
                                                }`}
                                        >
                                            {day}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Reward Section */}
                    <div className="bg-mint/50 p-4 rounded-3xl border border-mint/70 space-y-4 shadow-sm">
                        <div className="flex bg-white/50 p-1 rounded-xl gap-1">
                            <button
                                type="button"
                                onClick={() => setRewardType('custom')}
                                className={`flex-1 py-2 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${rewardType === 'custom'
                                    ? 'bg-white text-slate-800 shadow-sm border border-mint/20'
                                    : 'text-slate-400 hover:bg-mint/50'
                                    }`}
                            >
                                <span>🎁</span> Regalo
                            </button>
                            <button
                                type="button"
                                onClick={() => setRewardType('money')}
                                className={`flex-1 py-2 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${rewardType === 'money'
                                    ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                                    : 'text-slate-400 hover:bg-mint/50'
                                    }`}
                            >
                                <span>💰</span> Dinero
                            </button>
                        </div>

                        <div className="transition-all duration-300">
                            {rewardType === 'money' ? (
                                <>
                                    <div className="flex justify-between items-end mb-2 px-1 animate-in fade-in slide-in-from-left-2 duration-300">
                                        <span className="text-sm font-semibold text-emerald-700/70">Cantidad:</span>
                                        <span className="text-3xl font-black text-emerald-600 tracking-tight leading-none">
                                            {Number(rewardAmount).toFixed(2)}€
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-mint shadow-sm animate-in zoom-in-95 duration-200">
                                        <div className="flex-1 px-2">
                                            <input
                                                type="range"
                                                min="0"
                                                max="10"
                                                step="0.5"
                                                value={rewardAmount}
                                                onChange={(e) => setRewardAmount(e.target.value)}
                                                className="w-full h-2 bg-emerald-100 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                                            />
                                        </div>

                                        <div className="flex gap-1">
                                            <button type="button" onClick={() => setRewardAmount((prev) => Math.min(100, Number(prev) + 1).toString())} className="px-3 py-1.5 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 active:scale-95 transition-all text-xs shadow-lg shadow-emerald-200">+1€</button>
                                            <button type="button" onClick={() => setRewardAmount((prev) => Math.min(100, Number(prev) + 5).toString())} className="px-3 py-1.5 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 active:scale-95 transition-all text-xs shadow-lg shadow-emerald-200">+5€</button>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <Input
                                    className="bg-white border-mint focus:border-emerald-500 focus:ring-emerald-200 animate-in fade-in slide-in-from-right-2 duration-300"
                                    placeholder="Ej: 30min de consola, Elegir cena..."
                                    value={customReward}
                                    onChange={(e) => setCustomReward(e.target.value)}
                                />
                            )}

                            {/* Streak Section */}
                            <div className="mt-4 pt-4 border-t border-green-100/50 space-y-3">
                                <div className="flex items-center justify-between">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (!streakEnabled) {
                                                setStreakDays('2');
                                                setStreakBonus('0.00');
                                                setStreakCustomReward('');
                                            }
                                            setStreakEnabled(!streakEnabled);
                                        }}
                                        className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm ${streakEnabled
                                            ? 'bg-orange-500 text-white shadow-orange-200 ring-2 ring-orange-200'
                                            : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                                            }`}
                                    >
                                        {streakEnabled ? '🔥 Racha Activada' : '⚪ Activar Racha'}
                                    </button>
                                </div>

                                {streakEnabled && (
                                    <div className="bg-orange-50/50 p-3 rounded-2xl border border-orange-100 animate-in slide-in-from-top-2 duration-200">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-2 text-sm text-orange-800/70 font-medium">
                                                <span>Recompensa extra por racha de</span>
                                                <div className="flex items-center bg-white rounded-lg px-2 py-0.5 border border-orange-200">
                                                    <span className="font-bold text-orange-600 mr-2">{streakDays}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => setStreakDays(p => Math.min(30, Number(p) + 1).toString())}
                                                        className="w-4 h-4 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center text-[10px] hover:bg-orange-200 font-bold"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                                <span>días:</span>
                                            </div>
                                            {rewardType === 'money' && (
                                                <span className="text-xl font-black text-orange-500">
                                                    {Number(streakBonus).toFixed(2)}€
                                                </span>
                                            )}
                                        </div>

                                        {rewardType === 'money' ? (
                                            <div className="flex justify-end gap-1">
                                                <button type="button" onClick={() => setStreakBonus((prev) => (Number(prev) + 1).toString())} className="px-3 py-1 bg-orange-500 text-white rounded-lg font-bold hover:bg-orange-600 active:scale-95 transition-all text-xs shadow-md shadow-orange-200">+1€</button>
                                                <button type="button" onClick={() => setStreakBonus((prev) => (Number(prev) + 5).toString())} className="px-3 py-1 bg-orange-500 text-white rounded-lg font-bold hover:bg-orange-600 active:scale-95 transition-all text-xs shadow-md shadow-orange-200">+5€</button>
                                            </div>
                                        ) : (
                                            <Input
                                                className="bg-white border-orange-200 focus:border-orange-500 focus:ring-orange-200 text-sm"
                                                placeholder="Ej: Cine, Parque de bolas..."
                                                value={streakCustomReward}
                                                onChange={(e) => setStreakCustomReward(e.target.value)}
                                            />
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Icons & Child Selector Row */}
                    <div className="flex gap-2">
                        {/* Icon Selector */}
                        <div className="relative flex-1">
                            <label className="text-xs font-bold text-slate-400 mb-1 block ml-1">ICONO</label>
                            <button
                                type="button"
                                onClick={() => setIsIconPickerOpen(!isIconPickerOpen)}
                                className="w-full h-[52px] px-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between hover:bg-slate-100 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-orange-500 shadow-sm">
                                        {(() => {
                                            const IconComponent = ICONS.find(i => i.name === selectedIcon)?.icon || Star;
                                            return <IconComponent size={18} />;
                                        })()}
                                    </div>
                                    <span className="text-sm font-medium text-slate-700 truncate">Icono de la tarea</span>
                                </div>
                                <ChevronDown size={16} className={`text-slate-400 transition-transform ${isIconPickerOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {isIconPickerOpen && (
                                <div className="absolute top-full left-0 right-0 mt-2 p-4 bg-white rounded-2xl border border-slate-200 shadow-xl z-20 animate-in fade-in zoom-in-95 duration-200 grid grid-cols-6 gap-2">
                                    {ICONS.map((item) => (
                                        <button
                                            key={item.name}
                                            type="button"
                                            onClick={() => {
                                                setSelectedIcon(item.name);
                                                setIsIconPickerOpen(false);
                                            }}
                                            className={`aspect-square rounded-xl flex items-center justify-center transition-all ${selectedIcon === item.name
                                                ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20 scale-110'
                                                : 'bg-slate-50 text-slate-400 hover:bg-orange-50 hover:text-orange-500 hover:scale-105'
                                                }`}
                                        >
                                            <item.icon size={20} />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Child Selector */}
                        <div className="relative w-[140px]">
                            <label className="text-xs font-bold text-slate-400 mb-1 block ml-1">HIJO</label>
                            <button
                                type="button"
                                onClick={() => setIsChildPickerOpen(!isChildPickerOpen)}
                                className="w-full h-[52px] px-3 bg-slate-50 border border-slate-200 rounded-xl flex flex-col justify-center gap-0.5 hover:bg-slate-100 transition-colors text-left"
                            >
                                <span className="text-[10px] uppercase font-bold text-slate-400 leading-none">Asignar a</span>
                                <div className="flex items-center justify-between w-full">
                                    <span className="text-sm font-bold text-slate-700 truncate block max-w-[90px]">
                                        {assignedTo === 'all' ? 'Todos' : childrenUsers.find(c => c.id === assignedTo)?.name || 'Hijo'}
                                    </span>
                                    <ChevronDown size={14} className="text-slate-400 shrink-0" />
                                </div>
                            </button>

                            {isChildPickerOpen && (
                                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl border border-slate-200 shadow-xl z-30 overflow-hidden animate-in fade-in slide-in-from-top-2">
                                    {childrenUsers.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => { setAssignedTo('all'); setIsChildPickerOpen(false); }}
                                            className="w-full text-left px-4 py-3 hover:bg-slate-50 text-sm font-bold text-slate-700 border-b border-slate-100 flex items-center gap-2"
                                        >
                                            <span>👥</span> A todos los hijos
                                        </button>
                                    )}
                                    {childrenUsers.map(child => (
                                        <button
                                            key={child.id}
                                            type="button"
                                            onClick={() => { setAssignedTo(child.id); setIsChildPickerOpen(false); }}
                                            className={`w-full text-left px-4 py-3 hover:bg-slate-50 text-sm flex items-center gap-2 ${assignedTo === child.id ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-slate-600'}`}
                                        >
                                            <span>{child.avatar}</span>
                                            {child.name}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Submit Buttons */}
                    <div className={`pt-4 ${taskToEdit ? 'flex gap-3' : ''}`}>
                        {taskToEdit && (
                            <Button
                                type="button"
                                variant="danger"
                                className="bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 shadow-none"
                                onClick={() => {
                                    if (window.confirm('¿Estás seguro de que quieres eliminar esta misión?')) {
                                        useStore.getState().deleteTask(taskToEdit.id);
                                        onClose();
                                    }
                                }}
                            >
                                Eliminar Tarea
                            </Button>
                        )}
                        <Button type="submit" variant="primary" fullWidth={!taskToEdit} size="lg" className="flex-1 shadow-xl shadow-primary/20 hover:shadow-primary/30 transform hover:-translate-y-0.5 transition-all">
                            {taskToEdit ? 'Guardar Cambios' : 'Crear Misión'}
                        </Button>
                    </div>
                </div>
            </form>
        </Modal>
    );
};
