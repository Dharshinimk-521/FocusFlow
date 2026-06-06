// shows each habit with its streak as a horizontal bar
// and today's completion rate as a big number

import useLocalStorage from '../../hooks/useLocalStorage'

function HabitChart() {
    const [habits] = useLocalStorage('habits', [])

    const total     = habits.length
    const completed = habits.filter(h => h.completedToday).length
    const rate      = total > 0 ? Math.round((completed / total) * 100) : 0
    const bestStreak = habits.length > 0
        ? Math.max(...habits.map(h => h.streak))
        : 0

    return (
        <div className="dash-card analytics-chart-card">
            <div className="dash-card-lbl">Habit Overview</div>

            {/* big completion rate */}
            <div className="habit-rate-row">
                <div className="habit-rate-number">{rate}%</div>
                <div className="habit-rate-sub">
                    completed today · best streak 🔥 {bestStreak}
                </div>
            </div>

            {/* per habit breakdown */}
            <div className="habit-breakdown-list">
                {habits.length === 0 ? (
                    <div className="task-empty">No habits yet — add some in Habits</div>
                ) : (
                    habits.map(h => (
                        <div key={h.id} className="habit-breakdown-row">
                            {/* completed dot */}
                            <span
                                className="habit-done-dot"
                                style={{
                                    background: h.completedToday ? '#378ADD' : '#e2e8f0'
                                }}
                            />
                            <span className="habit-breakdown-name">{h.name}</span>
                            <div className="habit-breakdown-bar-wrap">
                                <div
                                    className="habit-breakdown-bar-fill"
                                    style={{
                                        width: `${Math.min((h.streak / 30) * 100, 100)}%`
                                        // 30 days streak = full bar
                                    }}
                                />
                            </div>
                            <span className="habit-breakdown-streak">
                                🔥 {h.streak}
                            </span>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default HabitChart