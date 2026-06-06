//renders one taskitem per task with map +handles filtering: all/active/completed
import {useState} from "react";
import TaskItem from "./TaskItem";
function TaskList({tasks,onComplete,onDelete}){
    //filters task based on active tab
    const [filter,setFilter] = useState('all') // all | active | cxomplted
    //creates an array that contain only the items that pass the condition- which are active
    const filtered = tasks.filter(task => {
        if(filter === 'active') return !task.completed //only incomplted
        if(filter ==='completed') return task.completed // only done
        return true //all-show everything
    })
    
    return(
        //contains filter tabs+task list +task-summary
        <div className="task-list-wrap">
            <div className="filter-tabs">
                <button 
                className={`filter-tab ${filter === 'all' ? 'active' : ''} `}
                onClick={() => setFilter('all')}>
                    All
                    <span className="tab-count">{tasks.length}</span>
                </button>
                <button 
                className={`filter-tab ${filter === 'active' ? 'active' : ''} `}
                onClick={() => setFilter('active')}>
                    Active
                    <span className="tab-count">{tasks.filter(t => !t.completed).length}</span>
                </button>
                <button 
                className={`filter-tab ${filter === 'completed' ? 'active' : ''} `}
                onClick={() => setFilter('completed')}>
                    Completed
                    <span className="tab-count">{tasks.filter(t => t.completed).length}</span>
        
                </button>
            </div>
            {/*task rows*/}
            <div className="task-list">
                {filtered.length === 0 ? (
                    //empty state -no tasks to show
                    <div className="task-empty">
                        {filter === 'completed' ? 'No completed tasks yet' : 'No tasks yet -add one above'}
                    </div>
                ) : (
                    filtered.map(task => (
                        <TaskItem
                        key={task.id} //react needs unique key when mappin
                        task={task} // full task obj
                        onComplete={onComplete}
                        onDelete={onDelete}
                        />
                    ))
                )}
            </div>
            {/*task summary*/}
            {tasks.length > 0 &&(
                <div className="task-summary">
                    {tasks.filter(t => t.completed).length} of {tasks.length} done
                </div>
            )}
            
        </div>
    )
}
export default TaskList