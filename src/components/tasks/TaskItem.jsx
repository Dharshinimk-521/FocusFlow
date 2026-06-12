//task item shape
// {
//     id: Date.now(),
//     text: "Learn React",
//     completed: false,
//     priority: "high",      // "high" | "medium" | "low"
//     createdAt: new Date().toISOString()
// } example:
//🔴  Learn React Router          [✓]  [✕]
// 🟡  Solve Leetcode              [ ]  [✕]
// 🟢  Drink Water                 [✓]  [✕]


function TaskItem({ task, onComplete, onDelete }) {

    const PriorityColors = {
        high: '#e53e3e', medium: '#d69e2e', low: '#38a169',
        High: '#e53e3e', Medium: '#d69e2e', Low: '#38a169'
    };

    const categoryIcons = { General: '📁', Work: '💼', Personal: '👤', Health: '💪', Urgent: '🚨' };

    return (
        <div className={`task-item ${task.completed ? 'completed' : ''}`}>
            {/*priority label*/}
            <span className="priority-dot" style={{ background: PriorityColors[task.priority || 'medium'] }} />
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="task-text">{task.text}</span>
                {task.category && (
                    <span style={{
                        fontSize: '11px', padding: '2px 8px', borderRadius: '12px',
                        background: 'rgba(55, 138, 221, 0.12)', color: '#378ADD',
                        fontFamily: 'JetBrains Mono, monospace', display: 'inline-flex', alignItems: 'center', gap: '4px'
                    }}>
                        {categoryIcons[task.category] || '📁'} {task.category}
                    </span>
                )}
            </div>
            <div className="task-actions">
                {/*checked or not*/}
                <button 
                className={`task-check ${task.completed ? 'checked' : ''}`} 
                onClick={() => onComplete(task.id)}>
                    {task.completed ? '✔' : ''}
                </button>

                {/*delete the task*/}
                <button 
                className="task-delete" 
                onClick={() => onDelete(task.id)}>✕
                </button>
            </div>
        </div>
    );
}

export default TaskItem;