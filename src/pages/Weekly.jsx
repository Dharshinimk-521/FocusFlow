
// Weekly.jsx — weekly planner page
// 7 day columns, tasks per day, progress rings, goal/reward, confetti on 100%

import '../styles/weekly.css';
import { useState, useEffect } from 'react';
import useUser from '../hooks/useUser';
import confetti from 'canvas-confetti';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// get current week's monday as base date string
function getWeekStart() {
    const d = new Date();
    const day = d.getDay(); //0-sun,1-mon..
    const diff = day === 0 ? -6 : 1 - day; //adjust so mon=0
    d.setDate(d.getDate() + diff);
    return d.toISOString().split('T')[0];
}

// get today's short day name "Mon" "Tue" etc
function getTodayLabel() {
    return new Date().toLocaleDateString('en-US', { weekday: 'short' });
}

// fire confetti in blue theme
function fireConfetti() {
    confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#378ADD', '#90cdf4', '#185FA5', '#ffffff', '#63b3ed']
    });
}

// circular progress ring component
function ProgressRing({ pct }) {
    const r = 20;
    const circ = 2 * Math.PI * r; //circumference
    const offset = circ * (1 - pct / 100); //how much to empty
    const color = pct === 100 ? '#38a169' : pct >= 50 ? '#378ADD' : '#718096';

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
    );
}

// single day column
function DayColumn({ day, tasks, isToday, onAdd, onToggle, onDelete }) {
    const [input, setInput] = useState('');

    const completed = tasks.filter(t => t.done).length;
    const total     = tasks.length;
    const pct       = total > 0 ? Math.round((completed / total) * 100) : 0;

    const handleAdd = () => {
        if (input.trim() === '') return;
        onAdd(day, input.trim());
        setInput('');
    };

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
                        <button 
                        className={`week-task-check ${task.done ? 'checked' : ''}`} 
                        onClick={() => onToggle(day, task.id)}>
                            {task.done ? '✔' : ''}
                            {/* complete button */}
                        </button>
                        <span className="week-task-text">{task.text}</span>
                        {/* delete */}
                        <button 
                        className="week-task-delete" 
                        onClick={() => onDelete(day, task.id)}>✕</button>
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
                onKeyDown={e => e.key === 'Enter' && handleAdd()} />
                <button 
                className="week-add-btn" 
                onClick={handleAdd}>+</button>
            </div>
        </div>
    );
}

//habit row across the week
function HabitRow({ habit, weekDays, weekStart }) {
    return (
        <div className="habit-week-row">

            <span className="habit-week-name">{habit.name}</span>
            <div className="habit-week-checks">
                {weekDays.map((day, i) => {
                    const d = new Date(weekStart);
                    d.setDate(d.getDate() + i);
                    const date = d.toISOString().split('T')[0];
                    const checked = habit.lastDone === date || (habit.completedToday && date === new Date().toISOString().split('T')[0]);
                    return (
                        <div key={day} className={`habit-week-cell ${checked ? 'habit-week-done' : ''}`} title={`${habit.name} — ${day}`}>
                            {checked ? '✔' : ''}
                        </div>
                    );
                })}
            </div>
            <span className="habit-week-pct">{habit.streak > 0 ? `🔥 ${habit.streak}` : '—'}</span>
        </div>
    );
}

function Weekly() {
    // weekly tasks stored as { Mon: [{id, text, done}], Tue: [...], ... }
    const {
        weeklyTasks,
        weeklyGoal,
        weeklyReward,
        addWeeklyTask,
        toggleWeeklyTask,
        deleteWeeklyTask,
        saveWeeklyGoalAndReward,
        logWeeklyConsistencyScore,
        resetWeeklyTasks,
        habits
    } = useUser();

    // goal and reward
    const [goalInput, setGoalInput] = useState(weeklyGoal);
    const [rewardInput, setRewardInput] = useState(weeklyReward);
    const [celebrated, setCelebrated] = useState({});

    const weekStart = getWeekStart();
    const today     = getTodayLabel();

    useEffect(() => {
        Promise.resolve().then(() => {
        setGoalInput(weeklyGoal);
        setRewardInput(weeklyReward);
    });
    }, [weeklyGoal, weeklyReward]);

    // check for 100% days and fire confetti
    useEffect(() => {
        DAYS.forEach(day => {
            const tasks = weeklyTasks[day] || [];
            const pct = tasks.length > 0 ? Math.round((tasks.filter(t => t.done).length / tasks.length) * 100) : 0;
            if (pct === 100 && tasks.length > 0 && !celebrated[day]) {
                fireConfetti();
                setCelebrated(prev => ({ ...prev, [day]: true }));
            }
        });
    }, [weeklyTasks, celebrated]);

    const allTasks = DAYS.flatMap(d => weeklyTasks[d] || []);
    const consistency = allTasks.length > 0 ? Math.round((allTasks.filter(t => t.done).length / allTasks.length) * 100) : 0;

    useEffect(() => {
        if (allTasks.length > 0) logWeeklyConsistencyScore(consistency);
    }, [consistency, allTasks.length,logWeeklyConsistencyScore]);

    return (
        <div className="weekly-page">
            {/* top bar — goal + reward */}
            <div className="weekly-top">
                <div className="weekly-goal-wrap">
                    <div className="weekly-goal-label">WEEKLY FOCUS</div>
                    <input className="weekly-goal-input" placeholder="Set goal..." value={goalInput} onChange={e => setGoalInput(e.target.value)} onBlur={() => saveWeeklyGoalAndReward(goalInput, rewardInput)} />
                </div>
                <div className="weekly-goal-wrap">
                    <div className="weekly-goal-label">🎁 REWARD</div>
                    <input className="weekly-goal-input" placeholder="Set reward..." value={rewardInput} onChange={e => setRewardInput(e.target.value)} onBlur={() => saveWeeklyGoalAndReward(goalInput, rewardInput)} />
                </div>
            </div>

             {/* 7 day columns */}
            <div className="weekly-grid">
                {DAYS.map(day => (
                    <DayColumn key={day} day={day} tasks={weeklyTasks[day] || []} isToday={day === today} onAdd={addWeeklyTask} onToggle={toggleWeeklyTask} onDelete={deleteWeeklyTask} />
                ))}
            </div>

            {/* habit tracker row */}
            {habits.length > 0 && (
                <div className="habit-week-wrap">
                    <div className="habit-week-header">
                        <span className="weekly-goal-label">HABIT TRACKER</span>
                        <div className="habit-week-day-labels">{DAYS.map(d => <span key={d} className="habit-day-lbl">{d}</span>)}</div>
                        <span className="weekly-goal-label">%</span>
                    </div>
                    {habits.map(h => <HabitRow key={h.id} habit={h} weekDays={DAYS} weekStart={weekStart} />)}
                </div>
            )}

            {/* bottom bar — reset + consistency */}
            <div className="weekly-bottom">
                <button className="weekly-reset-btn" onClick={handleReset}>↺ Reset Week</button>
                <div className="weekly-consistency">Consistency: <span className="consistency-val">{consistency}%</span></div>
            </div>
        </div>
    );

    function handleReset() {
        resetWeeklyTasks();
        setGoalInput('');
        setRewardInput('');
        setCelebrated({});
    }
}

export default Weekly;