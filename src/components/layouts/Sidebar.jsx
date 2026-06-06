//left side navigation to all the pages
//links to all pages-aut adds active class when on that route
//navlink is used to take u to another page n tells whether u are alr there
import { NavLink } from 'react-router-dom';

import { LayoutDashboard,
    CheckSquare,
    Flame,
    Timer,
    Trophy,
    BarChart2,
    Zap //for logo
} from 'lucide-react';
function Sidebar (){
     const links = [
        { to: '/',             label: 'Dashboard',   icon: <LayoutDashboard size={18} /> },
        { to: '/tasks',        label: 'Tasks',       icon: <CheckSquare     size={18} /> },
        { to: '/habits',       label: 'Habits',      icon: <Flame           size={18} /> },
        { to: '/focus',        label: 'Focus',       icon: <Timer           size={18} /> },
        { to: '/achievements', label: 'Achievements',icon: <Trophy          size={18} /> },
        { to: '/analytics',    label: 'Analytics',   icon: <BarChart2       size={18} /> },
    ]
    return (
        //aside=side-content
        <aside className='sidebar'>
            <div className='sidebar-logo'>
                <Zap sixe={20} color="#378ADD" />
                <span className="logo-text">FocusFlow</span>
            </div>
            <nav className='sidebar-nav'>
                {links.map(link => (
                    <NavLink
                    key={link.to}
                    to={link.to}
                    end={link.to === '/'}
                    className={({isActive}) =>
                    `sidebar-link ${isActive ? 'active' :''}`}>
                        <span className='link-icon'>{link.icon}</span>
                        <span className='link-label'>{link.label}</span>
                    </NavLink>
                ))}
            </nav>
            <div className='sidebar-footer'>
                <span className='sidebar-version'>v1.0</span>
            </div>
        </aside>
    )
}
export default Sidebar;