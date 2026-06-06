// single badge — locked or unlocked

function BadgeCard({ badge, unlocked }) {
    return (
        <div className={`badge-card ${unlocked ? 'unlocked' : 'locked'}`}>
            <div className="badge-icon">
                {unlocked ? badge.icon : '🔒'}
            </div>
            <div className="badge-label">{badge.label}</div>
            <div className="badge-desc">{badge.description}</div>
            {unlocked && (
                <div className="badge-earned">Earned</div>
            )}
        </div>
    )
}

export default BadgeCard