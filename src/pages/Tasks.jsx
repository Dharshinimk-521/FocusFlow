// Tasks.jsx is the brain of the whole feature

// it owns:
// ├── tasks array in useLocalStorage   ← persists across refresh
// ├── onAdd      → adds new task to array
// ├── onComplete → toggles completed true/false
// ├── onDelete   → removes task by id

// renders:
// ├── TaskForm   ← to add tasks
// └── TaskList   ← to show tasks


import useUser from '../hooks/useUser';
import TaskForm from '../components/tasks/TaskForm';
import TaskList from '../components/tasks/TaskList';

function Tasks() {
    const { tasks, addTask, completeTask, deleteTask } = useUser();
    //add-uses newtask obg in taskforms
    const onAdd = (newTask) =>addTask(newTask)
    const onComplete = (id) => completeTask(id);
    const onDelete = (id) => deleteTask(id);

    //header
    const completed = tasks.filter(t => t.completed).length;
    const total = tasks.length;

    return (
        //has page header+progress bar + renders taskform and tasklist
        <div className="tasks-page">

            {/* page header */}
            <div className="page-header">
                <h1 className="page-title">Tasks</h1>
                {total > 0 && <span className="page-subtitle">{completed} / {total} done</span>}
            </div>

            {/*progress bar*/}
            {total > 0 && (
                <div className="progress-bar-wrap">
                    <div className="progress-bar-fill" style={{ width: `${(completed / total) * 100}%` }} // inline style because it's dynamic — CSS can't know the value
                    />
                </div>
            )}
            {/*render taskform*/}
            <TaskForm onAdd={onAdd} />

            {/*render tasklist*/}
            <TaskList 
            tasks={tasks} 
            onComplete={onComplete} 
            onDelete={onDelete} />
        </div>
    );
}

export default Tasks;