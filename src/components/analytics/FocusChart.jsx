// bar chart — focus sessions per day
// reads focusSessions count + builds per-day data from localStorage


import useUser from '../../hooks/useUser';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

function FocusChart() {
    const { sessions, dailyFocusLog: dailyLog } = useUser();

    const last7 = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        const date = d.toISOString().split('T')[0];
        return {
            day:      d.toLocaleDateString('en-US', { weekday: 'short' }),
            sessions: dailyLog[date] || 0
        };
    });

    return (
        <div className="dash-card analytics-chart-card">
            <div className="dash-card-lbl">
                Focus Sessions — Last 7 Days
            </div>
            <div className="focus-total-label">
                {sessions} total sessions · {sessions * 25} mins focused
            </div>

            <ResponsiveContainer width="100%" height={200}>

                <BarChart data={last7} barSize={28}>

                    <CartesianGrid 
                    strokeDasharray="3 3" 
                    stroke="#e2e8f0" 
                    vertical={false} />

                    <XAxis 
                    dataKey="day" 
                    tick={{ fontSize: 12, fontFamily: 'JetBrains Mono', fill: '#718096' }}
                     axisLine={false} 
                     tickLine={false} />

                    <YAxis 
                    tick={{ fontSize: 12, fontFamily: 'JetBrains Mono', fill: '#718096' }} 
                    axisLine={false} 
                    tickLine={false} 
                    allowDecimals={false} />

                    <Tooltip 
                    contentStyle={{ background: '#1a2535', border: 'none', borderRadius: '8px', fontSize: '13px', fontFamily: 'JetBrains Mono', color: '#f7fafc' }} 
                    cursor={{ fill: 'rgba(55,138,221,0.08)' }} />

                    <Bar 
                    dataKey="sessions" 
                    fill="#185FA5" 
                    radius={[4, 4, 0, 0]} />
                    
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

export default FocusChart;