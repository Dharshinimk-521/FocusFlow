//renders one taskitem per task with map +handles filtering: all/active/completed
import { useState } from "react";
import TaskItem from "./TaskItem";

function TaskList({ tasks, onComplete, onDelete }) {
    //filters task based on active tab
    const [statusFilter, setStatusFilter] = useState('all');// all | active | cxomplted
    const [categoryFilter, setCategoryFilter] = useState('all');

    const categories = ['all', 'General', 'Work', 'Personal', 'Health', 'Urgent'];

    // Double Filter Logic
    //creates an array that contain only the items that pass the condition- which are active
    const filtered = tasks.filter(task => {
        if (statusFilter === 'active' && task.completed) return false;//only incomplete
        if (statusFilter === 'completed' && !task.completed) return false;//only done
        if (categoryFilter !== 'all' && (task.category || 'General').toLowerCase() !== categoryFilter.toLowerCase()) return false;
        return true;//show everything
    });

    return (
        //contains filter tabs+task list +task-summary
        <div className="task-list-wrap">
            <div className="filter-tabs">
                <button 
                className={`filter-tab ${statusFilter === 'all' ? 'active' : ''}`} 
                onClick={() => setStatusFilter('all')}>
                    All 
                    <span className="tab-count">{tasks.length}</span>
                    </button>
                <button 
                className={`filter-tab ${statusFilter === 'active' ? 'active' : ''}`} 
                onClick={() => setStatusFilter('active')}>
                    Active 
                    <span className="tab-count">{tasks.filter(t => !t.completed).length}</span>
                    </button>
                <button 
                className={`filter-tab ${statusFilter === 'completed' ? 'active' : ''}`} 
                onClick={() => setStatusFilter('completed')}>
                    Completed 
                    <span className="tab-count">{tasks.filter(t => t.completed).length}</span>
                    </button>
            </div>

            {/* Render Horizontal Category Filter Tabs */}
            <div className="filter-tabs" style={{ marginTop: '8px', flexWrap: 'wrap', gap: '6px' }}>
                {categories.map(cat => {
                    const count = cat === 'all' ? tasks.length : tasks.filter(t => (t.category || 'General').toLowerCase() === cat.toLowerCase()).length;
                    return (
                        <button 
                        key={cat} 
                        className={`filter-tab ${categoryFilter === cat ? 'active' : ''}`} 
                        onClick={() => setCategoryFilter(cat)} 
                        style={{ padding: '4px 10px', fontSize: '12px' }}>
                            {cat === 'all' ? '🌐 All' : cat}
                            <span className="tab-count" style={{ fontSize: '10px' }}>{count}</span>
                        </button>
                    );
                })}
            </div>
            {/*task rows*/}
            <div className="task-list" style={{ marginTop: '16px' }}>
                {filtered.length === 0 ? <div className="task-empty">
                    No tasks match your filters.</div> : filtered.map(t => (
                    <TaskItem key={t.id} task={t} onComplete={onComplete} onDelete={onDelete} />
                ))}
            </div>
        </div>
    );
}

export default TaskList;