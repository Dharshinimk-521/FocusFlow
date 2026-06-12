// bar chart — tasks completed per day for last 7 days
// reads from tasks in localStorage

import useUser from '../../hooks/useUser';
import { BarChart,
     Bar, 
     XAxis, 
     YAxis, 
     Tooltip, 
     ResponsiveContainer, 
     CartesianGrid } from 'recharts';

function TasksChart() {
    const { tasks } = useUser();

    // build last 7 days
    const last7 = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        return {
            date:  d.toISOString().split('T')[0],
            label: d.toLocaleDateString('en-US', { weekday: 'short' })
        };
    });

    // count completed tasks per day
    const tasksByDay = {};
    tasks.forEach(t => {
        if (t.completed && t.createdAt) {
            const day = t.createdAt.split('T')[0];
            tasksByDay[day] = (tasksByDay[day] || 0) + 1;
        }
    });

    const data = last7.map(({ date, label }) => ({ day: label, tasks: tasksByDay[date] || 0 }));

    return (
        <div className="dash-card analytics-chart-card">
            <div className="dash-card-lbl">
                Tasks Completed — Last 7 Days
                </div>
            {/* Makes chart responsive */}
            <ResponsiveContainer width="100%" height={200}>
                <BarChart data={data} barSize={28}>

                    {/* Background grid lines */}
                    <CartesianGrid 
                    strokeDasharray="3 3" 
                    stroke="#e2e8f0" 
                    vertical={false} />

                    {/* X-axis (Sun Mon Tue...) */}
                    <XAxis 
                    dataKey="day" 
                    tick={{ fontSize: 12, fontFamily: 'JetBrains Mono', 
                    fill: '#718096' }} 
                    axisLine={false} 
                    tickLine={false} />

                    {/* Y-axis (0,1,2,3...) */}
                    <YAxis 
                    tick={{ fontSize: 12, fontFamily: 'JetBrains Mono', fill: '#718096' }} 
                    axisLine={false} 
                    tickLine={false} a
                    llowDecimals={false} />

                    {/* Popup shown when hovering */}
                    <Tooltip 
                    contentStyle={{ background: '#1a2535', border: 'none', borderRadius: '8px', fontSize: '13px', fontFamily: 'JetBrains Mono', color: '#f7fafc' }} 
                    cursor={{ fill: 'rgba(55,138,221,0.08)' }} />

                    {/* Actual blue bars */}
                    <Bar 
                    dataKey="tasks" 
                    fill="#378ADD" 
                    radius={[4, 4, 0, 0]} />
                    
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

export default TasksChart;