// Tasks.jsx is the brain of the whole feature

// it owns:
// ├── tasks array in useLocalStorage   ← persists across refresh
// ├── onAdd      → adds new task to array
// ├── onComplete → toggles completed true/false
// ├── onDelete   → removes task by id

// renders:
// ├── TaskForm   ← to add tasks
// └── TaskList   ← to show tasks


import useLocalStorage from '../hooks/useLocalStorage'
import TaskForm from '../components/tasks/TaskForm'
import TaskList from '../components/tasks/TaskList'

function Tasks(){
    const [tasks,setTasks] = useLocalStorage('tasks',[]) //key-tasks,[]-initaial empty array
    //add-uses newtask obg in taskforms
    const onAdd = (newTask) =>{
        setTasks(prev => [...prev, newTask]) //spread existing add new toi the end

    }
    //complete-toggle cpomplete tyrye/false by id
    const onComplete = (id) =>{
        setTasks(prev => 
            prev.map(task =>
                task.id === id ? {...task,completed : !task.completed}//make it completed if id matches
                : task //leave the rest alone
            )
        )}
        //onDElete: filter out task with matching id
    const onDelete = (id) => {
        setTasks(prev => 
            prev.filter(task => task.id!== id)
        )//keep everythong except this id

    }
        //header
    const completed = tasks.filter(t => t.completed).length
    const total = tasks.length
    return(
        //has page header+progress bar + renders taskform and tasklist
        <div className='tasks-page'>
            {/* page header */}
            <div className="page-header">
                <h1 className="page-title">Tasks to do</h1>
                {total > 0 && (
                    <span className="page-subtitle">
                        {completed} / {total} done
                    </span>
                )}
            </div>
            {/*progress bar*/}
            {total > 0 && (
            <div className="progress-bar-wrap">
                <div
                    className="progress-bar-fill"
                    style={{ width: `${(completed / total) * 100}%` }}
                    // inline style because it's dynamic — CSS can't know the value
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