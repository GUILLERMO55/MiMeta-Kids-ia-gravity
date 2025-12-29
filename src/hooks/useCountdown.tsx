import { useState, useEffect } from 'react';
import { differenceInMinutes, parseISO, format } from 'date-fns';

interface TimeRemaining {
    hours: number;
    minutes: number;
    totalMinutes: number;
}

export const useTimeRemaining = (taskDate?: string, taskTime?: string): TimeRemaining | null => {
    const [timeRemaining, setTimeRemaining] = useState<TimeRemaining | null>(null);

    useEffect(() => {
        if (!taskDate || !taskTime) return;

        const updateTimeRemaining = () => {
            try {
                const now = new Date();
                const [hours, minutes] = taskTime.split(':').map(Number);
                const taskDateTime = parseISO(taskDate);
                taskDateTime.setHours(hours, minutes, 0, 0);

                const diffMinutes = differenceInMinutes(taskDateTime, now);

                if (diffMinutes < 0) {
                    setTimeRemaining(null);
                    return;
                }

                const remainingHours = Math.floor(diffMinutes / 60);
                const remainingMinutes = diffMinutes % 60;

                setTimeRemaining({
                    hours: remainingHours,
                    minutes: remainingMinutes,
                    totalMinutes: diffMinutes
                });
            } catch (error) {
                setTimeRemaining(null);
            }
        };

        updateTimeRemaining();
        const interval = setInterval(updateTimeRemaining, 60000); // Update every minute

        return () => clearInterval(interval);
    }, [taskDate, taskTime]);

    return timeRemaining;
};

interface CountdownBadgeProps {
    taskDate?: string;
    taskTime?: string;
}

export const CountdownBadge: React.FC<CountdownBadgeProps> = ({ taskDate, taskTime }) => {
    const timeRemaining = useTimeRemaining(taskDate, taskTime);

    if (!timeRemaining) return null;

    const { hours, minutes, totalMinutes } = timeRemaining;

    // Determine badge color and animation based on time remaining
    let badgeClasses = 'px-2 py-1 rounded-lg text-xs font-black border flex items-center gap-1 ';

    if (totalMinutes <= 30) {
        // Red and blinking when 30 minutes or less
        badgeClasses += 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-red-300 dark:border-red-800 animate-pulse';
    } else if (totalMinutes <= 60) {
        // Orange when 1 hour or less
        badgeClasses += 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 border-orange-300 dark:border-orange-800';
    } else {
        // Green when more than 1 hour
        badgeClasses += 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 border-green-300 dark:border-green-800';
    }

    const formatTime = () => {
        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        }
        return `${minutes}m`;
    };

    return (
        <div className={badgeClasses}>
            <span>⏱️</span>
            <span>{formatTime()}</span>
        </div>
    );
};
