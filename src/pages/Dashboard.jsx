// pulls data from localStorage — tasks, habits, sessions
// shows overview of everything in one place


import useLocalStorage from '../hooks/useLocalStorage'
import GreetingCard from '../components/dashboard/GreetingCard'
import StreakCard from '../components/dashboard/StreakCard'
import ProgressCard from '../components/dashboard/ProgressCard'
import WeatherWidget from '../components/dashboard/WeatherWidget'
import QuoteWidget from '../components/dashboard/QuoteWidget'
import HeatmapWidget from '../components/dashboard/HeatmapWidget'

function Dashboard() {
    const [tasks]   = useLocalStorage('tasks', [])
    const [habits]  = useLocalStorage('habits', [])
    const sessions  = Number(localStorage.getItem('focusSessions')) || 0

    const completedTasks  = tasks.filter(t => t.completed).length
    const totalTasks      = tasks.length
    const completedHabits = habits.filter(h => h.completedToday).length
    const totalHabits     = habits.length

    // best streak across all habits
    const bestStreak = habits.length > 0
        ? Math.max(...habits.map(h => h.streak))
        : 0

    return (
        <div className="dashboard-page">

            {/* greeting */}
            <GreetingCard />

            {/* top row — streak + tasks progress + habits progress */}
            <div className="dashboard-grid-top">
                <StreakCard streak={bestStreak} />
                <ProgressCard
                    label="Tasks"
                    completed={completedTasks}
                    total={totalTasks}
                    color="#378ADD"
                />
                <ProgressCard
                    label="Habits"
                    completed={completedHabits}
                    total={totalHabits}
                    color="#38a169"
                />
                <div className="stat-card-dash">
                    <span className="stat-val">{sessions}</span>
                    <span className="stat-lbl">Focus Sessions</span>
                </div>
            </div>

            {/* middle row — weather + quote */}
            <div className="dashboard-grid-mid">
                <WeatherWidget />
                <QuoteWidget />
            </div>

            {/* heatmap */}
            <HeatmapWidget tasks={tasks} />

        </div>
    )
}

export default Dashboard;