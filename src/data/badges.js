// all possible badges
// unlocked is determined at runtime by checking localStorage data
// not stored here — computed in Achievements.jsx

const badges = [
    {
        id:          'first_task',
        icon:        '✅',
        label:       'First Step',
        description: 'Complete your first task',
        condition:   (data) => data.completedTasks >= 1,
    },
    {
        id:          'five_tasks',
        icon:        '📋',
        label:       'Getting Things Done',
        description: 'Complete 5 tasks',
        condition:   (data) => data.completedTasks >= 5,
    },
    {
        id:          'twenty_five_tasks',
        icon:        '🏆',
        label:       'Task Master',
        description: 'Complete 25 tasks',
        condition:   (data) => data.completedTasks >= 25,
    },
    {
        id:          'first_habit',
        icon:        '🌱',
        label:       'Habit Formed',
        description: 'Complete a habit for the first time',
        condition:   (data) => data.completedHabits >= 1,
    },
    {
        id:          'streak_7',
        icon:        '🔥',
        label:       '7 Day Streak',
        description: 'Maintain a 7 day habit streak',
        condition:   (data) => data.bestStreak >= 7,
    },
    {
        id:          'streak_30',
        icon:        '💎',
        label:       '30 Day Streak',
        description: 'Maintain a 30 day habit streak',
        condition:   (data) => data.bestStreak >= 30,
    },
    {
        id:          'first_focus',
        icon:        '⏱',
        label:       'First Focus',
        description: 'Complete your first focus session',
        condition:   (data) => data.sessions >= 1,
    },
    {
        id:          'focus_master',
        icon:        '🧠',
        label:       'Focus Master',
        description: 'Complete 10 focus sessions',
        condition:   (data) => data.sessions >= 10,
    },
    {
        id:          'all_habits',
        icon:        '⭐',
        label:       'Perfect Day',
        description: 'Complete all habits in a day',
        condition:   (data) => data.allHabitsToday,
    },
]

export default badges;