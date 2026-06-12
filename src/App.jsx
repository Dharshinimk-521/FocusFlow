import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import useTheme from './hooks/useTheme';
import useUser from './hooks/useUser';
import Navbar from './components/layouts/Navbar';
import Sidebar from './components/layouts/Sidebar';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Habits from './pages/Habits';
import Focus from './pages/Focus';
import Achievements from './pages/Achievements';
import Analytics from './pages/Analytics';
import Weekly from './pages/Weekly';
import Auth from './components/auth/Auth';

import './styles/index.css';
import './styles/theme.css';
import './styles/components.css';

function App() {
    const { theme, toggleTheme } = useTheme();
    const { loading, user, newlyUnlockedBadge, setNewlyUnlockedBadge } = useUser();

    // 1. Sleek loading splash screen to prevent UI flashes during auth resolution
    if (loading) {
        return (
            <div className={`loading-screen ${theme}`} style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                fontFamily: 'JetBrains Mono, monospace',
                gap: '1rem',
                background: theme === 'dark' ? '#111827' : '#f5f5f5',
                color: theme === 'dark' ? '#f7fafc' : '#1a202c'
            }}>
                <div className="spinner" style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    border: '3px solid rgba(55, 138, 221, 0.2)',
                    borderTopColor: '#378ADD',
                    animation: 'spin 1s linear infinite'
                }} />
                <span>Loading FocusFlow...</span>
                <style>{`
                    @keyframes spin {
                        to { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        );
    }

    return (
        <div className={theme}>
            <BrowserRouter>
                <Sidebar />
                <div className="app-body"> {/* Sits next to sidebar */}
                    <Navbar theme={theme} toggleTheme={toggleTheme} />
                    
                    <main className="main-content">
                        <Routes>
                            <Route path="/"             element={<Dashboard />} />
                            <Route path="/tasks"        element={<Tasks />} />
                            <Route path="/weekly"       element={<Weekly />} />
                            <Route path="/habits"       element={<Habits />} />
                            <Route path="/focus"        element={<Focus />} />
                            <Route path="/achievements" element={<Achievements />} />
                            <Route path="/analytics"    element={<Analytics />} />
                            
                            {/* Route to the login page (Redirects to dashboard if logged in) */}
                            <Route 
                                path="/login" 
                                element={user ? <Navigate to="/" replace /> : <Auth />} 
                            />
                        </Routes>
                    </main>
                </div>
            </BrowserRouter>

            {/* 2. Achievement Celebration Modal Overlay */}
            {newlyUnlockedBadge && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.82)',
                    backdropFilter: 'blur(10px)',
                    zIndex: 9999,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontFamily: 'JetBrains Mono, monospace'
                }}>
                    <div className="dash-card animate-pop" style={{
                        width: '90%',
                        maxWidth: '400px',
                        padding: '2.5rem',
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '1.25rem',
                        background: theme === 'dark' ? '#1a2535' : '#ffffff',
                        border: '1px solid rgba(55,138,221,0.25)',
                        boxShadow: '0 8px 40px rgba(0, 0, 0, 0.45)',
                        transform: 'scale(1)',
                        animation: 'pop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards'
                    }}>
                        <div style={{ 
                            fontSize: '80px', 
                            margin: '0 0 10px 0', 
                            animation: 'float 2.5s ease-in-out infinite' 
                        }}>
                            {newlyUnlockedBadge.icon}
                        </div>
                        <h2 style={{ margin: 0, color: '#378ADD', fontSize: '22px', fontWeight: '800' }}>
                            Achievement Unlocked!
                        </h2>
                        <h3 style={{ margin: 0, color: theme === 'dark' ? '#f7fafc' : '#1a202c', fontSize: '18px', fontWeight: '700' }}>
                            {newlyUnlockedBadge.label}
                        </h3>
                        <p style={{ margin: 0, color: '#718096', fontSize: '14px', lineHeight: 1.5 }}>
                            {newlyUnlockedBadge.description}
                        </p>
                        <button
                            onClick={() => setNewlyUnlockedBadge(null)}
                            className="btn-main"
                            style={{ width: '100%', marginTop: '10px' }}
                        >
                            Awesome!
                        </button>
                    </div>
                    <style>{`
                        @keyframes pop {
                            from { transform: scale(0.7); opacity: 0; }
                            to { transform: scale(1); opacity: 1; }
                        }
                        @keyframes float {
                            0% { transform: translateY(0px); }
                            50% { transform: translateY(-12px); }
                            100% { transform: translateY(0px); }
                        }
                    `}</style>
                </div>
            )}
        </div>
    );
}

export default App;