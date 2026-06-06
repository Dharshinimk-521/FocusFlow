// global state — tasks, habits, sessions available everywhere
// Context API — solves "prop drilling"
// prop drilling = passing data through many components just to reach one deep child
// context = put data in one place, any component grabs it directly
import { createContext} from 'react'
import useLocalStorage from '../hooks/useLocalStorage'

// // createContext makes a "container" that holds shared dat
const UserContext = createContext(null)

// provider(wrapper component) — wraps the whole app
// any component INSIDE it can access the value
export function UserProvider({ children }) {
    const [tasks,  setTasks]  = useLocalStorage('tasks',  [])
    const [habits, setHabits] = useLocalStorage('habits', [])
    const sessions = Number(localStorage.getItem('focusSessions')) || 0

    // tasks logic
    const addTask = (newTask) => {
        setTasks(prev => [...prev, newTask])
    }

    const completeTask = (id) => {
        setTasks(prev =>
            prev.map(task =>
                task.id === id
                    ? { ...task, completed: !task.completed }
                    : task
            )
        )
    }

    const deleteTask = (id) => {
        setTasks(prev => prev.filter(task => task.id !== id))
    }

    // habits logic
    const addHabit = (newHabit) => {
        setHabits(prev => [...prev, newHabit])
    }

    const completeHabit = (id) => {
        const today     = new Date().toISOString().split('T')[0]
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        const yesterdayStr = yesterday.toISOString().split('T')[0]

        setHabits(prev =>
            prev.map(habit => {
                if (habit.id !== id)       return habit
                if (habit.completedToday)  return habit  // already done today

                const streakContinues = habit.lastDone === yesterdayStr

                return {
                    ...habit,
                    completedToday: true,
                    lastDone:       today,
                    streak: streakContinues ? habit.streak + 1 : 1
                }
            })
        )
    }

    const deleteHabit = (id) => {
        setHabits(prev => prev.filter(habit => habit.id !== id))
    }

    // derived stats — computed once, available everywhere
    const completedTasks  = tasks.filter(t => t.completed).length
    const completedHabits = habits.filter(h => h.completedToday).length
    const bestStreak      = habits.length > 0
        ? Math.max(...habits.map(h => h.streak))
        : 0
    const habitRate       = habits.length > 0
        ? Math.round((completedHabits / habits.length) * 100)
        : 0

    return (
        // value = everything components can access via useUser()
        <UserContext.Provider value={{
            tasks,
            habits,
            sessions,
            addTask,
            completeTask,
            deleteTask,
            addHabit,
            completeHabit,
            deleteHabit,
            completedTasks,
            completedHabits,
            bestStreak,
            habitRate,
        }}>
            {children} {/* render everything inside the provider */}
        </UserContext.Provider>
    )
}


export default UserContext