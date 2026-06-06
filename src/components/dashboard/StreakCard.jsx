// shows best streak across all habits

function StreakCard({ streak }) {
    return (
        <div className="dash-card streak-card">
            <span className="streak-fire-big">🔥</span>
            <div>
                <div className="dash-card-val">{streak}</div>
                <div className="dash-card-lbl">Day Streak</div>
            </div>
        </div>
    )
}

export default StreakCard