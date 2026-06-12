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

function TaskForm({ onAdd }) {
    const [text, setText] = useState('');//input field
    const [priority, setPriority] = useState('medium'); //input field
    const [category, setCategory] = useState('General'); // Category Tag

    const handleAdd = () => {
        if (text.trim() === '') return; //no empty tasks allowed
        
        onAdd({
            id: Date.now(),
            text: text.trim(),
            completed: false,//incomplete task
            priority,
            category,
            createdAt: new Date().toISOString() //for sorting/analytics
        });
        setText('');//reset text
        setPriority('medium'); //reset priority
        setCategory('General');
    };

    return (
        //contains priority select+task-input+task-add-btn
        <div className="task-form">

            {/*priority input*/}
            <select 
            className="priority-select" 
            value={priority} 
            onChange={e => setPriority(e.target.value)}>
                <option value="high">🔴 High</option>
                <option value="medium">🟡 Medium</option>
                <option value="low">🟢 Low</option>
            </select>

            {/* Category Select Input Dropdown */}
            <select 
            className="priority-select" 
            value={category} onChange={e => setCategory(e.target.value)} style={{ marginLeft: '4px' }}>
                <option value="General">📁 General</option>
                <option value="Work">💼 Work</option>
                <option value="Personal">👤 Personal</option>
                <option value="Health">💪 Health</option>
                <option value="Urgent">🚨 Urgent</option>
            </select>

            {/*textinput*/}
            <input 
            className="task-input" 
            type="text" 
            placeholder="Add task..." 
            value={text} 
            onChange={e => setText(e.target.value)} 
            onKeyDown={e => e.key === 'Enter' && handleAdd()} />
            <button 
            className="task-add-btn" 
            onClick={handleAdd}>+ Add</button>
            
        </div>
    );
}

export default TaskForm;