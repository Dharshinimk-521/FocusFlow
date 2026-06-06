//habits to build for consistency+ streak logic
// page — owns all habit data and logic

import useLocalStorage from '../hooks/useLocalStorage'
import HabitForm from '../components/habits/HabitForm'
import HabitList from '../components/habits/HabitList'

function Habits() {
    const [habits, setHabits] = useLocalStorage('habits', [])

    // add
    const onAdd = (newHabit) => {
        setHabits(prev => [...prev, newHabit])
    }

    //  streak logic lives
    const onComplete = (id) => {
        const today = new Date().toISOString().split('T')[0]  // "2026-06-06"

        setHabits(prev =>
            prev.map(habit => {
                if (habit.id !== id) return habit  // leave others alone

                // already completed today — don't count again
                if (habit.completedToday) return habit

                // check if yesterday was also done — for streak continuity
                const yesterday = new Date()
                yesterday.setDate(yesterday.getDate() - 1)
                const yesterdayStr = yesterday.toISOString().split('T')[0]

                const streakContinues = habit.lastDone === yesterdayStr  // its a streak if the habit was checked yesterday too

                return {
                    ...habit,
                    completedToday: true,
                    lastDone: today,
                    streak: streakContinues
                        ? habit.streak + 1   // continue streak
                        : 1                  // reset to 1 — starting fresh
                }
            })
        )
    }

    // Delete
    const onDelete = (id) => {
        setHabits(prev => prev.filter(habit => habit.id !== id))
    }

    // reset completedToday every new day
    // runs on mount — checks if lastDone was not today, resets completedToday
    const today = new Date().toISOString().split('T')[0]
    const resetIfNewDay = (habits) =>
        habits.map(habit => {
            if (habit.lastDone !== today && habit.completedToday) {
                return { ...habit, completedToday: false }  // new day — reset
            }
            return habit
        })

    // apply reset on load
    const habitsReset = resetIfNewDay(habits)

    const completed = habitsReset.filter(h => h.completedToday).length
    const total     = habitsReset.length

    return (
        <div className="habits-page">

            {/* header */}
            <div className="page-header">
                <h1 className="page-title">Habits for Consistency</h1>
                {total > 0 && (
                    <span className="page-subtitle">
                        {completed} / {total} today
                    </span>
                )}
            </div>

            {/* progress bar */}
            {total > 0 && (
                <div className="progress-bar-wrap">
                    <div
                        className="progress-bar-fill"
                        style={{ width: `${(completed / total) * 100}%` }}
                    />
                </div>
            )}

            {/* form */}
            <HabitForm onAdd={onAdd} />

            {/* list */}
            <HabitList
                habits={habitsReset}
                onComplete={onComplete}
                onDelete={onDelete}
            />

        </div>
    )
}

export default Habits;