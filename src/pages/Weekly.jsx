import '../styles/weekly.css';
// Weekly.jsx — weekly planner page
// 7 day columns, tasks per day, progress rings, goal/reward, confetti on 100%

import { useState, useEffect } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'
import confetti from 'canvas-confetti'


const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

// get current week's monday as base date string
function getWeekStart() {
    const d = new Date()
    const day = d.getDay()                          // 0=Sun, 1=Mon ...
    const diff = day === 0 ? -6 : 1 - day          // adjust so Mon=0
    d.setDate(d.getDate() + diff)
    return d.toISOString().split('T')[0]            // "2026-06-02"
}

// get today's short day name "Mon" "Tue" etc
function getTodayLabel() {
    return new Date().toLocaleDateString('en-US', { weekday: 'short' })
}

// fire confetti in blue theme
function fireConfetti() {
    confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#378ADD', '#90cdf4', '#185FA5', '#ffffff', '#63b3ed']
    })
}

// circular progress ring component
function ProgressRing({ pct }) {
    const r = 20
    const circ = 2 * Math.PI * r                   // circumference
    const offset = circ * (1 - pct / 100)          // how much to "empty"

    const color = pct === 100 ? '#38a169'           // green when done
                : pct >= 50  ? '#378ADD'            // blue halfway
                :              '#718096'            // grey when low

    return (
        <svg width="52" height="52" viewBox="0 0 52 52">
            {/* background track */}
            <circle cx="26" cy="26" r={r} fill="none" stroke="#2d3748" strokeWidth="4" />
            {/* progress arc */}
            <circle
                cx="26" cy="26" r={r}
                fill="none"
                stroke={color}
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={circ}
                strokeDashoffset={offset}
                style={{ transform: 'rotate(-90deg)', transformOrigin: 'center', transition: 'stroke-dashoffset 0.4s ease' }}
            />
            {/* percentage text */}
            <text x="26" y="30" textAnchor="middle" fontSize="10" fill={color} fontFamily="JetBrains Mono, monospace" fontWeight="700">
                {pct}%
            </text>
        </svg>
    )
}

// single day column
function DayColumn({ day, tasks, isToday, onAdd, onToggle, onDelete }) {
    const [input, setInput] = useState('')

    const completed = tasks.filter(t => t.done).length
    const total     = tasks.length
    const pct       = total > 0 ? Math.round((completed / total) * 100) : 0

    const handleAdd = () => {
        if (input.trim() === '') return
        onAdd(day, input.trim())
        setInput('')
    }

    const handleKey = (e) => {
        if (e.key === 'Enter') handleAdd()
    }

    return (
        <div className={`week-col ${isToday ? 'week-col-today' : ''}`}>
            {/* column header */}
            <div className="week-col-header">
                <div>
                    <div className={`week-day-label ${isToday ? 'week-day-today' : ''}`}>
                        {day}
                        {isToday && <span className="today-badge">Today</span>} 
                    </div>
                </div>
                <ProgressRing pct={pct} />
            </div>

            {/* task list */}
            <div className="week-task-list">
                {tasks.map(task => (
                    <div key={task.id} className={`week-task-item ${task.done ? 'week-task-done' : ''}`}>
                        {/* complete button */}
                        <button
                            className={`week-task-check ${task.done ? 'checked' : ''}`}
                            onClick={() => onToggle(day, task.id)}
                        >
                            {task.done ? '✔' : ''}
                        </button>
                        <span className="week-task-text">{task.text}</span>
                        {/* delete */}
                        <button
                            className="week-task-delete"
                            onClick={() => onDelete(day, task.id)}
                        >
                            ✕
                        </button>
                    </div>
                ))}
            </div>

            {/* add input at bottom */}
            <div className="week-add-row">
                <input
                    className="week-task-input"
                    placeholder="Add task..."
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKey}
                />
                <button className="week-add-btn" onClick={handleAdd}>+</button>
            </div>
        </div>
    )
}

// habit row across the week
function HabitRow({ habit, weekDays, weekStart }) {
    // build date string for each day of this week
    const getDayDate = (index) => {
        const d = new Date(weekStart)
        d.setDate(d.getDate() + index)
        return d.toISOString().split('T')[0]
    }

    return (
        <div className="habit-week-row">
            <span className="habit-week-name">{habit.name}</span>
            <div className="habit-week-checks">
                {weekDays.map((day, i) => {
                    const date    = getDayDate(i)
                    const checked = habit.lastDone === date || habit.completedToday && getDayDate(i) === new Date().toISOString().split('T')[0]
                    return (
                        <div
                            key={day}
                            className={`habit-week-cell ${checked ? 'habit-week-done' : ''}`}
                            title={`${habit.name} — ${day}`}
                        >
                            {checked ? '✔' : ''}
                        </div>
                    )
                })}
            </div>
            <span className="habit-week-pct">
                {habit.streak > 0 ? `🔥 ${habit.streak}` : '—'}
            </span>
        </div>
    )
}

function Weekly() {
    // weekly tasks stored as { Mon: [{id, text, done}], Tue: [...], ... }
    const [weekTasks, setWeekTasks] = useLocalStorage('weeklyTasks', {
        Mon: [], Tue: [], Wed: [], Thu: [], Fri: [], Sat: [], Sun: []
    })

    // goal and reward
    const [goal,   setGoal]   = useLocalStorage('weeklyGoal',   '')
    const [reward, setReward] = useLocalStorage('weeklyReward', '')

    // habits from global storage
    const [habits] = useLocalStorage('habits', [])

    const weekStart = getWeekStart()
    const today     = getTodayLabel()

    // track which days already fired confetti
    const [celebrated, setCelebrated] = useState({})

    // check for 100% days and fire confetti
    useEffect(() => {
        DAYS.forEach(day => {
            const tasks     = weekTasks[day] || []
            const total     = tasks.length
            const completed = tasks.filter(t => t.done).length
            const pct       = total > 0 ? Math.round((completed / total) * 100) : 0

            if (pct === 100 && total > 0 && !celebrated[day]) {
                fireConfetti()
                setCelebrated(prev => ({ ...prev, [day]: true }))
            }
        })
    }, [weekTasks])

    // add task to a day
    const addTask = (day, text) => {
        setWeekTasks(prev => ({
            ...prev,
            [day]: [...(prev[day] || []), { id: Date.now(), text, done: false }]
        }))
    }

    // toggle task done
    const toggleTask = (day, id) => {
        setWeekTasks(prev => ({
            ...prev,
            [day]: prev[day].map(t =>
                t.id === id ? { ...t, done: !t.done } : t
            )
        }))
    }

    // delete task
    const deleteTask = (day, id) => {
        setWeekTasks(prev => ({
            ...prev,
            [day]: prev[day].filter(t => t.id !== id)
        }))
    }

    // reset whole week
    const resetWeek = () => {
        setWeekTasks({ Mon: [], Tue: [], Wed: [], Thu: [], Fri: [], Sat: [], Sun: [] })
        setGoal('')
        setReward('')
        setCelebrated({})
    }

    // overall consistency score
    const allTasks    = DAYS.flatMap(d => weekTasks[d] || []) //map.flat() so basically all the tasks in total for the week
    const allDone     = allTasks.filter(t => t.done).length
    const consistency = allTasks.length > 0
        ? Math.round((allDone / allTasks.length) * 100) //depends on tasks alone not habits
        : 0

    return (
        <div className="weekly-page">

            {/* top bar — goal + reward */}
            <div className="weekly-top">
                <div className="weekly-goal-wrap">
                    <div className="weekly-goal-label">WEEKLY FOCUS</div>
                    <input
                        className="weekly-goal-input"
                        placeholder="Set your weekly goal..."
                        value={goal}
                        onChange={e => setGoal(e.target.value)}
                    />
                </div>
                <div className="weekly-goal-wrap">
                    <div className="weekly-goal-label">🎁 REWARD</div>
                    <input
                        className="weekly-goal-input"
                        placeholder="What's your reward this week?"
                        value={reward}
                        onChange={e => setReward(e.target.value)}
                    />
                </div>
            </div>

            {/* 7 day columns */}
            <div className="weekly-grid">
                {DAYS.map(day => (
                    <DayColumn
                        key={day}
                        day={day}
                        tasks={weekTasks[day] || []}
                        isToday={day === today}
                        onAdd={addTask}
                        onToggle={toggleTask}
                        onDelete={deleteTask}
                    />
                ))}
            </div>

            {/* habit tracker row */}
            {habits.length > 0 && (
                <div className="habit-week-wrap">
                    <div className="habit-week-header">
                        <span className="weekly-goal-label">HABIT TRACKER</span>
                        <div className="habit-week-day-labels">
                            {DAYS.map(d => (
                                <span key={d} className="habit-day-lbl">{d}</span>
                            ))}
                        </div>
                        <span className="weekly-goal-label">%</span>
                    </div>
                    {habits.map(h => (
                        <HabitRow
                            key={h.id}
                            habit={h}
                            weekDays={DAYS}
                            weekStart={weekStart}
                        />
                    ))}
                </div>
            )}

            {/* bottom bar — reset + consistency */}
            <div className="weekly-bottom">
                <button className="weekly-reset-btn" onClick={resetWeek}>
                    ↺ Reset Week
                </button>
                <div className="weekly-consistency">
                    Consistency: <span className="consistency-val">{consistency}%</span>
                </div>
            </div>

        </div>
    )
}

export default Weekly