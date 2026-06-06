//Timer
import useTimer from "../../hooks/useTimer";
import { useState } from "react";
import "../../styles/components.css";

function Timer() {
    const CIRCUMFERENCE = 2 * Math.PI * 118; // 741.4
    const { timeLeft, isRunning, sessions, display, start, pause, reset, short, long, focus } = useTimer() //get current theme+toggle func
    const [total, setTotal] = useState(25 * 60)
    const [currentMode, setCurrentMode] = useState('Focus');

    const switchmode = (secs, label, hooFn) => {
        setTotal(secs);
        setCurrentMode(label)
        hooFn() //call hook func
    }

    return (
        <div className="timer-wrap">
            <h1>Timer</h1>
            <div className="sections-mode">
                <button
                    className={`mode-tab ${currentMode == 'Focus' ? 'active' : ''}`}
                    onClick={() => switchmode(25 * 60, 'Focus', focus)}  
                >
                    Focus
                </button>
                <button
                    className={`mode-tab ${currentMode == 'Short Break' ? 'active' : ''}`}
                    onClick={() => switchmode(5 * 60, 'Short Break', short)}
                >
                    Short Break
                </button>
                <button
                    className={`mode-tab ${currentMode == 'Long Break' ? 'active' : ''}`}
                    onClick={() => switchmode(15 * 60, 'Long Break', long)}  
                >
                    Long Break
                </button>
            </div>

            <div className="timer-ring-wrap">  

                {/* r=118 gives circumference of 741.4 — used in stroke-dasharray
                    rotate -90deg so progress starts from top not right
                    stroke-dashoffset controls how much of the ring is "filled" */}
                <svg
                    className="timer-svg"
                    width="260"
                    height="260"
                    viewBox="0 0 260 260"
                    style={{ transform: 'rotate(-90deg)' }}
                >
                    {/* background track — always full circle */}
                    <circle
                        className="ring-bg"
                        cx="130"
                        cy="130"
                        r="118"
                    />

                    {/* progress ring — shrinks as time passes */}
                    <circle
                        className="ring-progress"
                        cx="130"
                        cy="130"
                        r="118"
                        strokeDasharray={CIRCUMFERENCE}
                        strokeDashoffset={CIRCUMFERENCE * (1 - timeLeft / total)}
                        // when timeLeft=total → offset=0 → full ring
                        // when timeLeft=0    → offset=741 → empty ring
                    />
                </svg>

                <div className="timer-display">
                    <div className="timer-digits">{display}</div>
                    <div className="timer-label">{currentMode}</div>
                </div>

            </div>

            <div className="controls">
                <button className="btn-sec" onClick={reset}>Reset</button>
                <button className="btn-main" onClick={isRunning ? pause : start}>
                    {isRunning ? 'Pause' : 'Start'}
                </button>
                <button className="btn-sec" onClick={() => switchmode(25 * 60, 'Focus', focus)}>
                    Skip
                </button>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <span className="stat-val">{sessions}</span>
                    <label className="stat-lbl">Sessions</label>
                </div>
                <div className="stat-card">
                    <span className="stat-val">{Math.round(((25*60) - timeLeft) / 60)}m</span>
                    <label className="stat-lbl">Today</label>
                </div>
                <div className="stat-card">
                    <span className="stat-val">{sessions * 25}m</span>
                    <label className="stat-lbl">Total</label>
                </div>
            </div>
        </div>
    );
}

export default Timer;