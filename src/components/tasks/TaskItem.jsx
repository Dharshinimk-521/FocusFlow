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


function TaskItem({task,onComplete,onDelete}){
    const Priority = {
        high : '#e53e3e',
        medium: '#d69e2e',
        low: '#38a169'
    }
    return(
        <div className={`task-item ${task.completed ? 'Completed' : ''}`}>
            {/*priority label*/}
            <span className="priority-dot" style={{background : Priority[task.priority]}}/>
            <span className="task-text">{task.text}</span>

            <div className="task-actions">
                {/*checked or not*/}
                <button className={`task-check ${task.completed ? 'checked' : ''}`}
                onClick={() => onComplete(task.id)} //tells which task to toggle
                aria-label="Complete task">
                    {task.completed ? '✔' : ''}
                </button>
                {/*delete the task*/}
                <button className="task-delete"
                onClick={() => onDelete(task.id)}//tells which task to delete
                aria-label="Delete task">
                    ✕
                </button>
            </div>

        </div>
    )
}
export default TaskItem