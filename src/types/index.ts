export type Role = 'parent' | 'child';

export interface Reward {
    type: 'money' | 'streak' | 'custom';
    value: number | string; // amount for money, name for custom
    streakId?: string; // if linked to a specific streak counter
}

export interface TaskMessage {
    id: string;
    from: 'parent' | 'child';
    message: string;
    timestamp: string;
}

export interface Task {
    id: string;
    title: string;
    description?: string;
    assignedTo: string; // childId
    createdBy: string; // parentId or childId (if proposed)
    status: 'pending' | 'waiting_approval' | 'completed' | 'rejected';
    type: 'unique' | 'repetitive'; // Legacy field, might be redundant with frequency

    // Advanced Recurrence Fields
    frequency?: 'diaria' | 'semanal';
    selectedDays?: number[]; // 0=Monday, 6=Sunday (Adjusted to match UI logic usually 0-6)
    weeklyFrequency?: number; // For non-specific days (e.g. 3 times a week)
    icon?: string;

    // Rewards & Gamification
    rewards: Reward[]; // Keeping this for backward compat / flexibility
    reward?: number; // Simplified access for main monetary reward
    nonMonetaryReward?: string;
    streakEnabled?: boolean;
    streakBonus?: number;
    streakCustomReward?: string;
    streakDays?: number;

    // Instance Management
    isInstance?: boolean;
    templateId?: string;
    taskDate?: string; // YYYY-MM-DD
    taskTime?: string; // HH:MM

    // Legacy/Other
    recurrence?: string[]; // Legacy
    dueDate?: string; // Legacy ISO date
    isUrgent: boolean;
    image?: string;
    proof?: string;
    completedAt?: string;
    selected?: boolean; // UI state for "active"

    // Photo Proof System
    proofPhoto?: string; // Base64 or URL of uploaded proof photo
    proofPhotoTimestamp?: string; // Extracted EXIF timestamp
    fraudWarning?: boolean; // True if photo timestamp doesn't match submission time

    // Conversation System
    conversation?: TaskMessage[]; // Messages between parent and child
    needsResponse?: boolean; // True if parent requested clarification
}

export interface User {
    id: string;
    name: string;
    role: Role;
    avatar: string;
    pin?: string; // simple security for parent
}

export interface ChildProfile extends User {
    role: 'child';
    balance: number;
    inventory: string[]; // non-monetary rewards earned
    level: number;
    xp: number;
    streak: number; // current daily streak
    lastStreakDate?: string;
    iban?: string;
    birthDate?: string;
}

export interface ParentProfile extends User {
    role: 'parent';
    childrenIds: string[];
}

export interface AppState {
    currentUser: User | null;
    users: (ChildProfile | ParentProfile)[];
    tasks: Task[];
    settings: {
        language: string;
        childMode: 'under12' | 'under18';
        darkMode: boolean;
    };
    filterChildId: string | null;
}
