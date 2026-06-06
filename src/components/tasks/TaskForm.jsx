// TaskForm is the input area at the top of the tasks page

// it has:
// ├── text input        "Add a new task..."
// ├── priority select   High / Medium / Low
// └── add button        [+ Add Task]

// when add clicked:
// ├── validates — no empty tasks
// ├── creates task object with id, text, priority, completed, createdAt
// ├── calls onAdd(newTask) → sends up to Tasks.jsx
// └── clears the input

import { useState } from "react";

function TaskForm({onAdd}){
    const [text,setText] = useState('')//input field
    const [priority,setPriority] = useState('medium') //priority
    const handleAdd = () => {
        if(text.trim() === '') return //no empty tasks allowed
        const newTask= { //new task obj
            id : Date.now(),
            text: text.trim(),
            completed : false, //incomplete task
            priority:priority, 
            createdAt: new Date().toISOString() //for sorting/analytics
        }
        onAdd(newTask)
        setText('')//reset text
        setPriority('medium')//reset priority
    }
    //if user preses enter to submit form
    const handleKeyDown= (e) =>{
        if(e.key ==='Enter') handleAdd()
    }
    return(
        //contains priority select+task-input+task-add-btn
        <div className="task-form">
            {/*priority input*/}
            <select className="priority-select"
            value={priority}
            onChange={e => setPriority(e.target.value)}>
                <option value="high">🔴 High</option>
                <option value="medium">🟡 Medium</option>
                <option value="low">🟢 Low</option>
            </select>
            {/*textinput*/}
            <input 
            className="task-input"
            type="text"
            placeholder="Add a new task..."
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={handleKeyDown}/>
            {/*add*/}
            <button 
            className="task-add-btn"
            onClick={handleAdd}>
                + Add
            </button>
        </div>
    )
}
export default TaskForm;