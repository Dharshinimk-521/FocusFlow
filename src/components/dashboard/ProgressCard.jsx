// reusable card — shows completed/total with a mini progress bar

function ProgressCard({ label, completed, total, color }) {
    const pct = total > 0 ? (completed / total) * 100 : 0

    return (
        <div className="dash-card progress-card">
            <div className="dash-card-lbl">{label}</div>
            <div className="dash-card-val">
                {completed}
                <span className="dash-card-total">/{total}</span>
            </div>
            <div className="mini-progress-wrap">
                <div
                    className="mini-progress-fill"
                    style={{ width: `${pct}%`, background: color }}
                />
            </div>
        </div>
    )
}

export default ProgressCard