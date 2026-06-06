// input to add a new habit
// only needs a name — no priority like tasks

import { useState } from 'react'

function HabitForm({ onAdd }) {
    const [name, setName] = useState('')

    const handleAdd = () => {
        if (name.trim() === '') return  // no empty habits

        const newHabit = {
            id:             Date.now(),
            name:           name.trim(),
            streak:         0,           // starts at zero
            lastDone:       null,        // never completed yet
            completedToday: false        // not done today
        }

        onAdd(newHabit)
        setName('')      // clear input
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleAdd()
    }

    return (
        <div className="habit-form">
            <input
                className="habit-input"
                type="text"
                placeholder="Add a new habit..."
                value={name}
                onChange={e => setName(e.target.value)}
                onKeyDown={handleKeyDown}
            />
            <button
                className="habit-add-btn"
                onClick={handleAdd}
            >
                + Add
            </button>
        </div>
    )
}

export default HabitForm