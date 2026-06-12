//habits to build for consistency+ streak logic
// page — owns all habit data and logic

import useUser from '../hooks/useUser';
import HabitForm from '../components/habits/HabitForm';
import HabitList from '../components/habits/HabitList';

function Habits() {
    const { habits, addHabit, completeHabit, deleteHabit } = useUser();

    //add
    const onAdd = (newHabit) => addHabit(newHabit);
    const onComplete = (id) => completeHabit(id);
    const onDelete = (id) => deleteHabit(id);

    const completed = habits.filter(h => h.completedToday).length;
    const total = habits.length;

    return (
        <div className="habits-page">

            {/* header */}
            <div className="page-header">
                <h1 className="page-title">Habits</h1>
                {total > 0 && <span className="page-subtitle">{completed} / {total} today</span>}
            </div>

            {/* progress bar */}
            {total > 0 && (
                <div className="progress-bar-wrap">
                    <div className="progress-bar-fill" style={{ width: `${(completed / total) * 100}%` }} />
                </div>
            )}
            {/* form */}
            <HabitForm onAdd={onAdd} />
            {/* list */}
            <HabitList habits={habits}
             onComplete={onComplete} 
             onDelete={onDelete} />
        </div>
    );
}

export default Habits;