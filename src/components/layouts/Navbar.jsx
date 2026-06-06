import { useLocation } from 'react-router-dom' //tells what url u are currently on
import ThemeToggle from './ThemeToggle';
import {
    LayoutDashboard,
    CheckSquare,
    Flame,
    Timer,
    Trophy,
    BarChart2
} from 'lucide-react'; //icon lib for react

function Navbar({theme,toggleTheme}) {
    const { pathname } = useLocation()

    const pages = {
        '/':             { title: 'Dashboard',    icon: <LayoutDashboard size={20} /> },
        '/tasks':        { title: 'Tasks',        icon: <CheckSquare     size={20} /> },
        '/habits':       { title: 'Habits',       icon: <Flame           size={20} /> },
        '/focus':        { title: 'Focus',        icon: <Timer           size={20} /> },
        '/achievements': { title: 'Achievements', icon: <Trophy          size={20} /> },
        '/analytics':    { title: 'Analytics',    icon: <BarChart2       size={20} /> },
    }

    const current = pages[pathname] || { title: 'FocusFlow', icon: null }

    return (
        <header className="navbar">
            <div className="navbar-left">
                <span className="navbar-icon">{current.icon}</span>
                <h2 className="navbar-title">{current.title}</h2>
            </div>

            <div className="navbar-right">
                <span className="navbar-date">
                    {new Date().toLocaleDateString('en-US', {
                        weekday: 'short',
                        month:   'short',
                        day:     'numeric'
                    })}
                </span>
                <ThemeToggle 
                theme={theme}
                toggleTheme={toggleTheme}/>

            </div>
        </header>
    )
}

export default Navbar