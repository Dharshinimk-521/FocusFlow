import { useLocation, NavLink } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import useUser from '../../hooks/useUser';
import {
    LayoutDashboard,
    CheckSquare,
    Flame,
    Timer,
    Trophy,
    BarChart2,
    CalendarDays
} from 'lucide-react';

function Navbar({ theme, toggleTheme }) {
    const { pathname } = useLocation();
    const { user } = useUser();

    const pages = {
        '/':             { title: 'Dashboard',    icon: <LayoutDashboard size={20} /> },
        '/tasks':        { title: 'Tasks',        icon: <CheckSquare     size={20} /> },
        '/weekly':       { title: 'Weekly Planner',icon: <CalendarDays   size={20} /> },
        '/habits':       { title: 'Habits',       icon: <Flame           size={20} /> },
        '/focus':        { title: 'Focus',        icon: <Timer           size={20} /> },
        '/achievements': { title: 'Achievements', icon: <Trophy          size={20} /> },
        '/analytics':    { title: 'Analytics',    icon: <BarChart2       size={20} /> },
    };

    const current = pages[pathname] || { title: 'FocusFlow', icon: null };

    return (
        <header className="navbar">
            <div className="navbar-left">
                <span className="navbar-icon">{current.icon}</span>
                <h2 className="navbar-title">{current.title}</h2>
            </div>

            <div className="navbar-right" style={{ display: 'flex', alignItems: 'center' }}>
                {/* Display Guest Warning if not authenticated */}
                {!user && (
                    <NavLink 
                        to="/login" 
                        style={{
                            textDecoration: 'none',
                            fontSize: '12px',
                            fontWeight: '600',
                            color: '#d69e2e',
                            background: 'rgba(214, 158, 46, 0.12)',
                            padding: '4px 10px',
                            borderRadius: '12px',
                            marginRight: '16px',
                            fontFamily: 'JetBrains Mono, monospace',
                            transition: 'background 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(214, 158, 46, 0.22)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(214, 158, 46, 0.12)'}
                    >
                        ⚠️ Guest Mode (Sign In)
                    </NavLink>
                )}
                <span className="navbar-date" style={{ marginRight: '16px' }}>
                    {new Date().toLocaleDateString('en-US', {
                        weekday: 'short',
                        month:   'short',
                        day:     'numeric'
                    })}
                </span>
                <ThemeToggle 
                    theme={theme}
                    toggleTheme={toggleTheme}
                />
            </div>
        </header>
    );
}

export default Navbar;