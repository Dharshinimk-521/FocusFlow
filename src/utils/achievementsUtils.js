// badge unlock logic extracted from Achievements.jsx
// keeps the page component clean

import badges from '../data/badges'

// takes raw data object, returns { unlocked[], locked[] }
export const getBadges = (data) => {
    const unlocked = badges.filter(b => b.condition(data))
    const locked   = badges.filter(b => !b.condition(data))
    return { unlocked, locked }
}

// builds the data object needed to check badge conditions
export const buildBadgeData = ({ tasks, habits, sessions }) => ({
    completedTasks:  tasks.filter(t => t.completed).length,
    completedHabits: habits.filter(h => h.completedToday).length,
    bestStreak:      habits.length > 0
                        ? Math.max(...habits.map(h => h.streak))
                        : 0,
    sessions,
    allHabitsToday:  habits.length > 0 && habits.every(h => h.completedToday),
})