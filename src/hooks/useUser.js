// custom hook that reads from UserContext


import { useContext } from 'react'
import UserContext from '../context/UserContext'

function useUser() {
    const context = useContext(UserContext)
    if (!context) throw new Error('useUser must be used inside UserProvider')
    // helpful error — without this you'd get silent undefined
    return context
}

export default useUser;