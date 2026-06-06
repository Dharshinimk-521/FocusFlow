import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { UserProvider } from './context/UserContext'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <UserProvider>      {/* ← wraps everything */}
            <App />
        </UserProvider>
    </StrictMode>
)