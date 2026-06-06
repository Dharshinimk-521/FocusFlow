//sigle habit rw: name, streak, complete toggle ,delete

function HabitItem({habit,onComplete,onDelete}){
    return(
        //habit-streak+habit-name+habit-ation
        <div className={`habit-item ${habit.completedToday ? 'habit-done' : '' }`}>
            {/*streak*/}
            <div className="habit-streak">
                <span className="streak-fire">🔥</span>
                <span className="streak-count">{habit.streak}</span>
            </div>
            {/*habit-name*/}
            <span className="habit-name">{habit.name}</span>
            <div className="habit-actions">
                {/*complete-toggle*/}
                <button 
                className={`habit-check ${habit.completedToday ? 'checked' :''}`}
                onClick={() => onComplete(habit.id)}
                aria-label="Complete habit">
                    {habit.completedToday ? '✔' : ''}
                    
                </button>
                {/*delete*/}
                <button 
                    className="habit-delete" 
                    onClick={() => onDelete(habit.id)} 
                    aria-label = "Delete habit">
                        ✕
                </button>
            </div>
        </div>
    )
}
export default HabitItem;