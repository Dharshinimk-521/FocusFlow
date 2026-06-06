// checks all badge conditions against real data
// shows unlocked + locked badges

import useLocalStorage from '../hooks/useLocalStorage'
import badges from '../data/badges'
import BadgeCard from '../components/achievements/BadgeCard'

function Achievements() {
    const [tasks]  = useLocalStorage('tasks', [])
    const [habits] = useLocalStorage('habits', [])
    const sessions = Number(localStorage.getItem('focusSessions')) || 0

    // data object passed to each badge condition
    const data = {
        completedTasks:  tasks.filter(t => t.completed).length,
        completedHabits: habits.filter(h => h.completedToday).length,
        bestStreak:      habits.length > 0
                            ? Math.max(...habits.map(h => h.streak))
                            : 0,
        sessions,
        allHabitsToday:  habits.length > 0 &&
                         habits.every(h => h.completedToday),
    }

    const unlocked = badges.filter(b => b.condition(data))
    const locked   = badges.filter(b => !b.condition(data))

    return (
        <div className="achievements-page">

            <div className="page-header">
                <h1 className="page-title">Achievements</h1>
                <span className="page-subtitle">
                    {unlocked.length} / {badges.length} earned
                </span>
            </div>

            {/* unlocked */}
            {unlocked.length > 0 && (
                <div className="achievements-section">
                    <h2 className="section-title">Earned</h2>
                    <div className="badge-grid">
                        {unlocked.map(badge => (
                            <BadgeCard
                                key={badge.id}
                                badge={badge}
                                unlocked={true}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* locked */}
            {locked.length > 0 && (
                <div className="achievements-section">
                    <h2 className="section-title">Locked</h2>
                    <div className="badge-grid">
                        {locked.map(badge => (
                            <BadgeCard
                                key={badge.id}
                                badge={badge}
                                unlocked={false}
                            />
                        ))}
                    </div>
                </div>
            )}

        </div>
    )
}

export default Achievements