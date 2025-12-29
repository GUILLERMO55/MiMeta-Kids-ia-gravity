import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppState, ChildProfile, ParentProfile, Task, User, TaskMessage } from '../types';
// import { addDays, isSameDay, parseISO } from 'date-fns';

interface StoreActions {
    setCurrentUser: (user: User | null) => void;
    addTask: (task: Task) => void;
    updateTask: (taskId: string, updates: Partial<Task>) => void;
    deleteTask: (taskId: string) => void;
    completeTask: (taskId: string, proof: string, proofPhoto?: string, proofPhotoTimestamp?: string, fraudWarning?: boolean) => void;
    validateTask: (taskId: string, approved: boolean) => void;
    addRewardToChild: (childId: string, amount: number) => void;
    deductBalance: (childId: string, amount: number) => void;
    redeemReward: (childId: string, itemIndex: number) => void;
    switchChildMode: (mode: 'under12' | 'under18') => void;
    toggleDarkMode: () => void;
    addTaskMessage: (taskId: string, message: TaskMessage) => void;
    requestClarification: (taskId: string, message: string) => void;
    addChild: (name: string, avatar: string, iban?: string, birthDate?: string) => void;
    updateChild: (childId: string, updates: Partial<ChildProfile>) => void;
    deleteChild: (childId: string) => void;
    setFilterChildId: (childId: string | null) => void;
}

// Mock Initial Data
const INITIAL_PARENT: ParentProfile = {
    id: 'p1',
    name: 'Papá/Mamá',
    role: 'parent',
    avatar: '👑',
    childrenIds: ['c1'],
    pin: '1234'
};

const INITIAL_CHILD: ChildProfile = {
    id: 'c1',
    name: 'Hijo/a',
    role: 'child',
    avatar: '🚀',
    balance: 5.50,
    inventory: [],
    level: 1,
    xp: 0,
    streak: 2,
    lastStreakDate: new Date().toISOString()
};

export const useStore = create<AppState & StoreActions>()(
    persist(
        (set, get) => ({
            currentUser: null, // Start logged out or select profile
            users: [INITIAL_PARENT, INITIAL_CHILD],
            tasks: [
                {
                    id: 't1',
                    title: 'Hacer la cama',
                    assignedTo: 'c1',
                    createdBy: 'p1',
                    status: 'pending',
                    type: 'repetitive',
                    recurrence: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
                    isUrgent: false,
                    rewards: [{ type: 'money', value: 1 }],
                    dueDate: new Date().toISOString()
                }
            ],
            settings: {
                language: 'es',
                childMode: 'under12',
                darkMode: false
            },
            filterChildId: null,

            setCurrentUser: (user) => set({ currentUser: user }),

            addTask: (task) => set((state) => ({
                tasks: [...state.tasks, {
                    ...task,
                    taskTime: task.taskTime?.trim(),
                    dueDate: task.dueDate?.trim()
                }]
            })),

            updateTask: (id, updates) => set((state) => ({
                tasks: state.tasks.map((t) => (t.id === id ? {
                    ...t,
                    ...updates,
                    taskTime: updates.taskTime ? updates.taskTime.trim() : t.taskTime,
                    dueDate: updates.dueDate ? updates.dueDate.trim() : t.dueDate
                } : t))
            })),

            deleteTask: (id) => set((state) => ({
                tasks: state.tasks.filter((t) => t.id !== id)
            })),

            completeTask: (id, proof, proofPhoto, proofPhotoTimestamp, fraudWarning) => set((state) => ({
                tasks: state.tasks.map((t) =>
                    t.id === id ? {
                        ...t,
                        status: 'waiting_approval',
                        proof,
                        proofPhoto,
                        proofPhotoTimestamp,
                        fraudWarning,
                        completedAt: new Date().toISOString()
                    } : t
                )
            })),

            validateTask: (id, approved) => {
                const state = get();
                const task = state.tasks.find((t) => t.id === id);
                if (!task) return;

                if (approved) {
                    // Distribute rewards
                    const childId = task.assignedTo;
                    const child = state.users.find(u => u.id === childId) as ChildProfile;

                    if (child) {
                        let newBalance = child.balance;
                        let newInventory = [...child.inventory];
                        let newXp = child.xp + 10; // Base XP

                        task.rewards.forEach(r => {
                            if (r.type === 'money') newBalance += Number(r.value);
                            if (r.type === 'custom') newInventory.push(String(r.value));
                        });

                        // Streak Logic
                        if (task.streakEnabled) {
                            if (task.streakBonus) newBalance += task.streakBonus;
                            if (task.streakCustomReward) newInventory.push(task.streakCustomReward);
                        }

                        // Update Child
                        const updatedUsers = state.users.map(u =>
                            u.id === childId ? { ...u, balance: newBalance, inventory: newInventory, xp: newXp } : u
                        );

                        set({
                            users: updatedUsers,
                            tasks: state.tasks.map(t => t.id === id ? { ...t, status: 'completed' } : t)
                        });
                    }
                } else {
                    set({ tasks: state.tasks.map(t => t.id === id ? { ...t, status: 'rejected' } : t) });
                }
            },

            addRewardToChild: (childId, amount) => set(state => ({
                users: state.users.map(u => u.id === childId ? { ...u, balance: (u as ChildProfile).balance + amount } : u)
            })),

            deductBalance: (childId, amount) => set(state => ({
                users: state.users.map(u => u.id === childId ? { ...u, balance: Math.max(0, (u as ChildProfile).balance - amount) } : u)
            })),

            redeemReward: (childId, itemIndex) => set(state => ({
                users: state.users.map(u => {
                    if (u.id === childId && u.role === 'child') {
                        const newInventory = [...(u as ChildProfile).inventory];
                        newInventory.splice(itemIndex, 1);
                        return { ...u, inventory: newInventory };
                    }
                    return u;
                })
            })),

            switchChildMode: (mode) => set(state => ({ settings: { ...state.settings, childMode: mode } })),

            toggleDarkMode: () => set(state => {
                const newDarkMode = !state.settings.darkMode;
                // Apply dark mode class to document root
                if (newDarkMode) {
                    document.documentElement.classList.add('dark');
                } else {
                    document.documentElement.classList.remove('dark');
                }
                return { settings: { ...state.settings, darkMode: newDarkMode } };
            }),

            addTaskMessage: (taskId, message) => set(state => ({
                tasks: state.tasks.map(t =>
                    t.id === taskId
                        ? { ...t, conversation: [...(t.conversation || []), message], needsResponse: message.from === 'parent' }
                        : t
                )
            })),

            requestClarification: (taskId, messageText) => {
                const newMessage: TaskMessage = {
                    id: Date.now().toString(),
                    from: 'parent',
                    message: messageText,
                    timestamp: new Date().toISOString()
                };

                set(state => ({
                    tasks: state.tasks.map(t =>
                        t.id === taskId
                            ? { ...t, conversation: [...(t.conversation || []), newMessage], needsResponse: true }
                            : t
                    )
                }));
            },

            addChild: (name, avatar, iban, birthDate) => {
                const state = get();
                const parent = state.users.find(u => u.role === 'parent') as ParentProfile;
                if (!parent) return;

                const newChild: ChildProfile = {
                    id: `c${Date.now()}`,
                    name,
                    role: 'child',
                    avatar,
                    balance: 0,
                    inventory: [],
                    level: 1,
                    xp: 0,
                    streak: 0,
                    lastStreakDate: new Date().toISOString(),
                    iban,
                    birthDate
                };

                set({
                    users: [
                        ...state.users.map(u =>
                            u.id === parent.id
                                ? { ...u, childrenIds: [...parent.childrenIds, newChild.id] }
                                : u
                        ),
                        newChild
                    ]
                });
            },

            updateChild: (childId, updates) => set(state => ({
                users: state.users.map(u =>
                    u.id === childId && u.role === 'child'
                        ? { ...u, ...updates }
                        : u
                )
            })),

            deleteChild: (childId) => {
                const state = get();
                const parent = state.users.find(u => u.role === 'parent') as ParentProfile;
                if (!parent) return;

                set({
                    users: state.users
                        .filter(u => u.id !== childId)
                        .map(u =>
                            u.id === parent.id
                                ? { ...u, childrenIds: parent.childrenIds.filter(id => id !== childId) }
                                : u
                        ),
                    tasks: state.tasks.filter(t => t.assignedTo !== childId)
                });
            },

            setFilterChildId: (childId) => set({ filterChildId: childId }),
        }),
        {
            name: 'mimeta-storage',
        }
    )
);
