// maps over habits, renders one HabitItem per habit
// shows empty state if no habits

import HabitItem from './HabitItem'

function HabitList({ habits, onComplete, onDelete }) {
    return (
        <div className="habit-list-wrap">
            <div className="habit-list">
                {habits.length === 0 ? (
                    <div className="habit-empty">
                        No habits yet — add one above
                    </div>
                ) : (
                    habits.map(habit => (
                        <HabitItem
                            key={habit.id}
                            habit={habit}
                            onComplete={onComplete}
                            onDelete={onDelete}
                        />
                    ))
                )}
            </div>

            {/* summary */}
            {habits.length > 0 && (
                <div className="habit-summary">
                    {habits.filter(h => h.completedToday).length} of {habits.length} done today
                </div>
            )}
        </div>
    )
}

export default HabitList