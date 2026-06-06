import useLocalStorage from '../hooks/useLocalStorage'
import TasksChart from '../components/analytics/TaskChart'
import FocusChart from '../components/analytics/FocusChart'
import HabitChart from '../components/analytics/HabitChart'

function Analytics() {
    const [tasks]  = useLocalStorage('tasks', [])
    const [habits] = useLocalStorage('habits', [])
    const sessions = Number(localStorage.getItem('focusSessions')) || 0

    const totalCompleted  = tasks.filter(t => t.completed).length
    const completedHabits = habits.filter(h => h.completedToday).length
    const totalHabits     = habits.length
    const habitRate       = totalHabits > 0
        ? Math.round((completedHabits / totalHabits) * 100)
        : 0
    const bestStreak = habits.length > 0
        ? Math.max(...habits.map(h => h.streak))
        : 0

    return (
        <div className="analytics-page">

            <div className="page-header">
                <h1 className="page-title">Analytics</h1>
            </div>

            {/* stat cards */}
            <div className="analytics-stats">
                <div className="dash-card">
                    <div className="dash-card-lbl">Tasks Completed</div>
                    <div className="dash-card-val">{totalCompleted}</div>
                </div>
                <div className="dash-card">
                    <div className="dash-card-lbl">Focus Sessions</div>
                    <div className="dash-card-val">{sessions}</div>
                </div>
                <div className="dash-card">
                    <div className="dash-card-lbl">Habit Rate</div>
                    <div className="dash-card-val">{habitRate}%</div>
                </div>
                <div className="dash-card">
                    <div className="dash-card-lbl">Best Streak</div>
                    <div className="dash-card-val">🔥 {bestStreak}</div>
                </div>
            </div>

            {/* charts */}
            <TasksChart />
            <FocusChart />
            <HabitChart />

        </div>
    )
}

export default Analytics;