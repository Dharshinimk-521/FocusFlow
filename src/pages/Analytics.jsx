import useUser from '../hooks/useUser';
import TasksChart from '../components/analytics/TaskChart';
import FocusChart from '../components/analytics/FocusChart';
import HabitChart from '../components/analytics/HabitChart';

function Analytics() {
    const { tasks, habits, sessions, weeklyHistory } = useUser();

    const totalCompleted  = tasks.filter(t => t.completed).length;
    const completedHabits = habits.filter(h => h.completedToday).length;
    const totalHabits     = habits.length;
    const habitRate       = totalHabits > 0 ? Math.round((completedHabits / totalHabits) * 100) : 0;
    const bestStreak = habits.length > 0 ? Math.max(...habits.map(h => h.streak)) : 0;

    return (
        <div className="analytics-page" style={{ paddingBottom: '3rem' }}>
            <div className="page-header"><h1 className="page-title">Analytics</h1></div>
            {/*stats card*/}
            <div className="analytics-stats">
                <div className="dash-card"><div className="dash-card-lbl">Tasks Completed</div><div className="dash-card-val">{totalCompleted}</div></div>
                <div className="dash-card"><div className="dash-card-lbl">Focus Sessions</div><div className="dash-card-val">{sessions}</div></div>
                <div className="dash-card"><div className="dash-card-lbl">Habit Rate</div><div className="dash-card-val">{habitRate}%</div></div>
                <div className="dash-card"><div className="dash-card-lbl">Best Streak</div><div className="dash-card-val">🔥 {bestStreak}</div></div>
            </div>

            {/*charts*/}
            <TasksChart />
            <FocusChart />
            <HabitChart />

            {/* Weekly Consistency Score History */}
            {weeklyHistory && weeklyHistory.length > 0 && (
                <div className="dash-card weekly-history-card" style={{ marginTop: '20px' }}>
                    <div className="dash-card-lbl" style={{ marginBottom: '16px' }}>Weekly Planning History</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {weeklyHistory.map(history => (
                            <div key={history.id} style={{
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                padding: '12px 16px', background: 'rgba(255, 255, 255, 0.02)',
                                border: '1px solid rgba(113, 128, 150, 0.15)', borderRadius: '8px'
                            }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    <span style={{ fontSize: '12px', color: '#718096', fontFamily: 'JetBrains Mono, monospace' }}>
                                        Week of {new Date(history.week_start).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </span>
                                    <span style={{ fontSize: '14px', fontWeight: '600', fontFamily: 'JetBrains Mono, monospace' }}>
                                        🎯 Focus: {history.goal || 'No goal set'}
                                    </span>
                                    {history.reward && (
                                        <span style={{ fontSize: '12px', color: '#38a169', fontFamily: 'JetBrains Mono, monospace' }}>
                                            🎁 Reward: {history.reward}
                                        </span>
                                    )}
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                                    <span style={{ 
                                        fontFamily: 'JetBrains Mono, monospace', fontSize: '20px', fontWeight: '700',
                                        color: history.consistency_score === 100 ? '#38a169' : history.consistency_score >= 50 ? '#378ADD' : '#718096'
                                    }}>{history.consistency_score}%</span>
                                    <span style={{ fontSize: '10px', color: '#718096', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Consistency</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Analytics;