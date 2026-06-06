import { BrowserRouter, Routes, Route } from 'react-router-dom'
import useTheme from './hooks/useTheme';
import Navbar from './components/layouts/Navbar'
import Sidebar from './components/layouts/Sidebar'
import Dashboard from './pages/Dashboard'
import Tasks from './pages/Tasks'
import Habits from './pages/Habits'
import Focus from './pages/Focus'
import Achievements from './pages/Achievements'
import Analytics from './pages/Analytics'

import './styles/index.css'
import './styles/theme.css'
import './styles/components.css'

function App() {
    const { theme, toggleTheme } = useTheme()

    return (
        <div className={theme}>
            <BrowserRouter>
                <Sidebar />
                <div className="app-body">        {/* sits next to sidebar */}
                    <Navbar theme={theme}
                    toggleTheme={toggleTheme}/>
                    
                    <main className="main-content">
                        <Routes>
                            <Route path="/"             element={<Dashboard />} />
                            <Route path="/tasks"        element={<Tasks />} />
                            <Route path="/habits"       element={<Habits />} />
                            <Route path="/focus"        element={<Focus />} />
                            <Route path="/achievements" element={<Achievements />} />
                            <Route path="/analytics"    element={<Analytics />} />
                        </Routes>
                    </main>
                </div>
            </BrowserRouter>
        </div>
    )
}

export default App