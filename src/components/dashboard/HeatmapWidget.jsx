// shows last 4 weeks of activity
// green = active day, yellow = partial, empty = no activity
// shows last 4 weeks of activity
// tracks both tasks completed AND habits completed per day

import useLocalStorage from '../../hooks/useLocalStorage'  // ← import habits here

function HeatmapWidget({ tasks }) {
    const [habits] = useLocalStorage('habits', [])  // ← pull habits directly

    // build last 28 days array oldest → newest ["2026-05-10", "2026-05-11", ...]
    const days = Array.from({ length: 28 }, (_, i) => { // creates 28 empty slots _ means we dont use the slot val and i index 0-27
        const d = new Date()
        d.setDate(d.getDate() - (27 - i)) // 27-i counts backwards: i=0 is oldest, i=27 is today
        return d.toISOString().split('T')[0]  // "2026-06-06T12:00:00.000Z" → "2026-06-06"
    })

    // count completed tasks per day by building an obj that count the tasks completed that day
    const tasksByDay = {}
    tasks.forEach(t => {
        if (t.completed && t.createdAt) { //only count the tasts that have date
            const day = t.createdAt.split('T')[0]
            tasksByDay[day] = (tasksByDay[day] || 0) + 1
        }
    })

    // count habit completions per day using lastDone
    const habitsByDay = {}
    habits.forEach(h => {
        if (h.lastDone) {
            habitsByDay[h.lastDone] = (habitsByDay[h.lastDone] || 0) + 1
        }
    })

    // combine both for activity level
    const getLevel = (day) => {
        const count = (tasksByDay[day] || 0) + (habitsByDay[day] || 0)
        if (count === 0) return 0
        if (count <= 2)  return 1
        if (count <= 4)  return 2
        return 3
    }

    const colors = {
        0: '#e2e8f0', //empty 
        1: '#90cdf4', //light 1/2 tasks
        2: '#378ADD',//medium 3/4 tasks
        3: '#185FA5',//dark = 5+tasks
    }

    return (
        <div className="dash-card heatmap-card">
            <div className="dash-card-lbl">Activity — Last 4 Weeks</div>
            <div className="heatmap-grid">
                {days.map(day => (
                    <div
                        key={day} //unique key for react
                        className="heatmap-cell"
                        style={{ background: colors[getLevel(day)] }}
                        title={`${day}: ${(tasksByDay[day] || 0) + (habitsByDay[day] || 0)} activities`} //tooltip on hover
                    />
                ))}
            </div>
            {/*shows what each color means*/}
            <div className="heatmap-legend">
                <span className="legend-label">Less</span>
                {[0, 1, 2, 3].map(l => (
                    <div
                        key={l}
                        className="heatmap-cell"
                        style={{ background: colors[l] }}
                    />
                ))}
                <span className="legend-label">More</span>
            </div>
        </div>
    )
}

export default HeatmapWidget