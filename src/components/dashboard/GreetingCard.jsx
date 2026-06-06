// shows greeting based on time of day

function GreetingCard() {
    const hour = new Date().getHours()

    const greeting =
        hour < 12 ? 'Good Morning' :
        hour < 17 ? 'Good Afternoon' :
                    'Good Evening'

    const emoji =
        hour < 12 ? '☀️' :
        hour < 17 ? '⛅' :
                    '🌙'

    return (
        <div className="greeting-card">
            <h1 className="greeting-text">
                {greeting} {emoji}
            </h1>
            <p className="greeting-sub">
                Here's your productivity overview for today.
            </p>
        </div>
    )
}

export default GreetingCard