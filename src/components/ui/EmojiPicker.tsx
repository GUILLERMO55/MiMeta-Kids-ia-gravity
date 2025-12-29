import React from 'react';

interface EmojiPickerProps {
    selectedEmoji: string;
    onSelect: (emoji: string) => void;
}

const AVAILABLE_EMOJIS = [
    // Kids & People
    '👦', '👧', '🧒', '👶', '🧑', '👨', '👩',
    // Animals
    '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🦄', '🐝', '🦋', '🐠', '🐙', '🦀',
    // Sports & Activities
    '⚽', '🏀', '🏈', '⚾', '🎾', '🏐', '🏓', '🏸', '🏒', '🏑', '🥊', '🎯', '⛳', '🏹', '🎣', '🥋', '🎮', '🎲', '🎸', '🎹', '🎤', '🎧', '🎨', '🎬',
    // Space & Fantasy
    '🚀', '🛸', '🌟', '⭐', '💫', '✨', '🌈', '🔥', '💎', '👑', '🏆', '🎖️',
    // Nature
    '🌺', '🌻', '🌼', '🌷', '🌹', '🌸', '🍀', '🌲', '🎄', '🌴', '🌵', '🪴',
    // Food
    '🍎', '🍕', '🍔', '🌮', '🍦', '🍰', '🍪', '🍩', '🧁', '🍓', '🍌', '🍉', '🍇', '🥤',
];

export const EmojiPicker: React.FC<EmojiPickerProps> = ({ selectedEmoji, onSelect }) => {
    return (
        <div className="grid grid-cols-8 gap-2 max-h-64 overflow-y-auto p-2 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
            {AVAILABLE_EMOJIS.map((emoji) => (
                <button
                    key={emoji}
                    type="button"
                    onClick={() => onSelect(emoji)}
                    className={`
                        text-2xl p-2 rounded-lg transition-all duration-200
                        hover:bg-white dark:hover:bg-slate-800 
                        hover:scale-110 hover:shadow-md
                        ${selectedEmoji === emoji
                            ? 'bg-indigo-100 dark:bg-indigo-900/30 ring-2 ring-indigo-500 scale-105'
                            : 'bg-transparent'
                        }
                    `}
                >
                    {emoji}
                </button>
            ))}
        </div>
    );
};
