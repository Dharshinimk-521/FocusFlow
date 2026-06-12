//left side navigation to all the pages
//links to all pages-aut adds active class when on that route
//navlink is used to take u to another page n tells whether u are alr there
import { NavLink } from 'react-router-dom';
import { CalendarDays, LogIn, LogOut } from 'lucide-react';
import {
    LayoutDashboard,
    CheckSquare,
    Flame,
    Timer,
    Trophy,
    BarChart2,
    Zap //for logo
} from 'lucide-react';
import useUser from '../../hooks/useUser';

function Sidebar() {
    const { user, profile, logout } = useUser();

    const links = [
        { to: '/',             label: 'Dashboard',   icon: <LayoutDashboard size={18} /> },
        { to: '/tasks',        label: 'Tasks',       icon: <CheckSquare     size={18} /> },
        { to: '/weekly',       label: 'Weekly',      icon: <CalendarDays    size={18} /> },
        { to: '/habits',       label: 'Habits',      icon: <Flame           size={18} /> },
        { to: '/focus',        label: 'Focus',       icon: <Timer           size={18} /> },
        { to: '/achievements', label: 'Achievements',icon: <Trophy          size={18} /> },
        { to: '/analytics',    label: 'Analytics',   icon: <BarChart2       size={18} /> },
    ];

    return (
        //aside content
        <aside className='sidebar'>
            <div className='sidebar-logo'>
                <Zap size={20} color="#378ADD" />
                <span className="logo-text">FocusFlow</span>
            </div>
            
            <nav className='sidebar-nav'>
                {links.map(link => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        end={link.to === '/'}
                        className={({ isActive }) =>
                            `sidebar-link ${isActive ? 'active' : ''}`
                        }
                    >
                        <span className='link-icon'>{link.icon}</span>
                        <span className='link-label'>{link.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className='sidebar-footer' style={{ 
                padding: '16px 8px', 
                borderTop: '1px solid rgba(113, 128, 150, 0.15)', 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '12px' 
            }}>
                {/* 1. If user is logged in, show username and sign-out button */}
                {user ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <img
                                src={profile?.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.id}`}
                                alt="Avatar"
                                style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(55, 138, 221, 0.15)' }}
                            />
                            <span style={{ 
                                fontSize: '13px', 
                                fontWeight: '600', 
                                fontFamily: 'JetBrains Mono, monospace', 
                                maxWidth: '110px', 
                                overflow: 'hidden', 
                                textOverflow: 'ellipsis', 
                                whiteSpace: 'nowrap'
                            }}>
                                {profile?.username || user.email.split('@')[0]}
                            </span>
                        </div>
                        <button
                            onClick={logout}
                            style={{ 
                                background: 'none', 
                                border: 'none', 
                                cursor: 'pointer', 
                                display: 'flex', 
                                alignItems: 'center', 
                                padding: '4px', 
                                color: '#a0aec0',
                                transition: 'color 0.2s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.color = '#e53e3e'}
                            onMouseLeave={(e) => e.currentTarget.style.color = '#a0aec0'}
                            title="Sign Out"
                        >
                            <LogOut size={16} />
                        </button>
                    </div>
                ) : (
                    // 2. If guest mode, show the navigation link to Auth screen
                    <NavLink 
                        to="/login" 
                        className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                        style={{ margin: 0, padding: '8px 12px' }}
                    >
                        <span className='link-icon'><LogIn size={18} /></span>
                        <span className='link-label'>Sign In</span>
                    </NavLink>
                )}
                <span className='sidebar-version' style={{ 
                    fontSize: '10px', 
                    textAlign: 'center', 
                    color: '#718096',
                    fontFamily: 'JetBrains Mono, monospace'
                }}>v1.1</span>
            </div>
        </aside>
    );
}

export default Sidebar;