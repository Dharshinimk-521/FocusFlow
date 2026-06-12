// global state — tasks, habits, sessions available everywhere
// Context API — solves "prop drilling"
// prop drilling = passing data through many components just to reach one deep child
// context = put data in one place, any component grabs it directly
import { createContext, useState, useEffect, useCallback,useRef } from 'react';
import { supabase } from '../supabaseClient';
import useLocalStorage from '../hooks/useLocalStorage';
import badges from '../data/badges';
import confetti from 'canvas-confetti';

// // createContext makes a "container" that holds shared dat
const UserContext = createContext(null)

// Helper function to calculate Monday date string for current week
function getWeekStart() {
  const d = new Date();
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d.toISOString().split('T')[0];
}
// provider(wrapper component) — wraps the whole app
// any component INSIDE it can access the value
export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fallback states for unauthenticated users (Guest Mode)
  const [localTasks, setLocalTasks] = useLocalStorage('tasks', []);
  const [localHabits, setLocalHabits] = useLocalStorage('habits', []);
  const [localWeeklyTasks, setLocalWeeklyTasks] = useLocalStorage('weeklyTasks', {
    Mon: [], Tue: [], Wed: [], Thu: [], Fri: [], Sat: [], Sun: []
  });
  const [localWeeklyGoal, setLocalWeeklyGoal] = useLocalStorage('weeklyGoal', '');
  const [localWeeklyReward, setLocalWeeklyReward] = useLocalStorage('weeklyReward', '');
  const [localSessions, setLocalSessions] = useState(
    () => Number(localStorage.getItem('focusSessions')) || 0
  );
  const [localDailyLog, setLocalDailyLog] = useState(
    () => JSON.parse(localStorage.getItem('focusDailyLog') || '{}')
  );

  // Active States accessed by the app components
  const [tasks, setTasks] = useState([]);
  const [habits, setHabits] = useState([]);
  const [weeklyTasks, setWeeklyTasks] = useState({
    Mon: [], Tue: [], Wed: [], Thu: [], Fri: [], Sat: [], Sun: []
  });
  const [weeklyGoal, setWeeklyGoal] = useState('');
  const [weeklyReward, setWeeklyReward] = useState('');
  const [sessions, setSessions] = useState(0);
  const [dailyFocusLog, setDailyFocusLog] = useState({});
  const [weeklyHistory, setWeeklyHistory] = useState([]);

  // Achievement pop-up tracking states
  const [newlyUnlockedBadge, setNewlyUnlockedBadge] = useState(null);
  const previouslyUnlockedIds = useRef(null);
  // 1. Listen to Supabase Auth State Changes
  useEffect(() => {
    // if there is already an active logged-in session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (!session) setLoading(false);
    });
    // Listen for authentication changes

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session) {
        setProfile(null);
        setLoading(false);
      }
    });
    return () => subscription.unsubscribe();
  }, []);
   
  // 2. Fetch profile info
  const fetchProfile = useCallback(async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      if (!error && data) setProfile(data);
    } catch (err) {
      console.error('Error fetching profile:', err);
    }
  }, []);
  // 3. Load entire user dashboard state from Supabase
  const fetchSupabaseData = useCallback(async (userId) => {
    setLoading(true);
    const today = new Date().toISOString().split('T')[0];
    const currentWeekStart = getWeekStart();
    try {
      await fetchProfile(userId);
      // Fetch Tasks
      const { data: dbTasks } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true });
      if (dbTasks) {
        setTasks(dbTasks.map(t => ({
          id: t.id,
          text: t.title, // Map backend 'title' column to frontend expected 'text' property
          priority: t.priority,
          completed: t.completed,
          category: t.category || 'General',
          createdAt: t.created_at
        })));
      }
      // Fetch Habits
      const { data: dbHabits } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true });
      if (dbHabits) {
        // Daily Habit Reset Check
        const processedHabits = dbHabits.map(h => {
          let completedToday = h.completed_today;
          if (h.last_done !== today && completedToday) {
            completedToday = false;
            // Update in DB asynchronously
            supabase.from('habits').update({ completed_today: false }).eq('id', h.id).then();
          }
          return {
            id: h.id,
            name: h.name,
            streak: h.streak,
            completedToday,
            lastDone: h.last_done
          };
        });
        setHabits(processedHabits);
      }
      // Fetch Focus Sessions
      const { data: dbSessions } = await supabase
        .from('focus_sessions')
        .select('*')
        .eq('user_id', userId);
      if (dbSessions) {
        setSessions(dbSessions.length);
        const log = {};
        dbSessions.forEach(s => {
          const dateStr = s.created_at.split('T')[0];
          log[dateStr] = (log[dateStr] || 0) + 1;
        });
        setDailyFocusLog(log);
      }
      // Fetch Weekly Planner
      const { data: dbWeeklyTasks } = await supabase
        .from('weekly_tasks')
        .select('*')
        .eq('user_id', userId)
        .eq('week_start', currentWeekStart);
      const weeklyStructure = {
        Mon: [], Tue: [], Wed: [], Thu: [], Fri: [], Sat: [], Sun: []
      };
      if (dbWeeklyTasks) {
        dbWeeklyTasks.forEach(t => {
          if (weeklyStructure[t.day_of_week]) {
            weeklyStructure[t.day_of_week].push({ id: t.id, text: t.text, done: t.done });
          }
        });
      }
      setWeeklyTasks(weeklyStructure);
      // Fetch Current Weekly Goal/Reward
      const { data: dbWeeklyGoal } = await supabase
        .from('weekly_goals')
        .select('*')
        .eq('user_id', userId)
        .eq('week_start', currentWeekStart)
        .maybeSingle();
      if (dbWeeklyGoal) {
        setWeeklyGoal(dbWeeklyGoal.goal || '');
        setWeeklyReward(dbWeeklyGoal.reward || '');
      } else {
        setWeeklyGoal('');
        setWeeklyReward('');
      }
      // Fetch Weekly History Logs (Extra Feature)
      const { data: dbHistory } = await supabase
        .from('weekly_goals')
        .select('*')
        .eq('user_id', userId)
        .order('week_start', { ascending: true });
      if (dbHistory) setWeeklyHistory(dbHistory);
    } catch (err) {
      console.error('Error fetching Supabase data:', err);
    } finally {
      setLoading(false);
    }
  }, [fetchProfile]);
  // Coordinator to toggle between Supabase fetch and LocalStorage sync
  useEffect(() => {
    if (user) {
      Promise.resolve().then(() => fetchSupabaseData(user.id));
    } else {
      Promise.resolve().then(() => {
        setTasks(localTasks);
        const today = new Date().toISOString().split('T')[0];
        const resetLocal = localHabits.map(h => {
          if (h.lastDone !== today && h.completedToday) {
          return { ...h, completedToday: false };
        }
        return h;
      });
    
      setHabits(resetLocal);
      setWeeklyTasks(localWeeklyTasks);
      setWeeklyGoal(localWeeklyGoal);
      setWeeklyReward(localWeeklyReward);
      setSessions(localSessions);
      setDailyFocusLog(localDailyLog);
      setWeeklyHistory([]);
      setLoading(false);
    });
  }
  }, [user, localTasks, localHabits, localWeeklyTasks, localWeeklyGoal, localWeeklyReward, localSessions, localDailyLog, fetchSupabaseData]);

  // Achievement pop-up listener (Runs calculations on stats change)
  useEffect(() => {
    if (loading) return;

    const stats = {
      completedTasks: tasks.filter(t => t.completed).length,
      completedHabits: habits.filter(h => h.completedToday).length,
      bestStreak: habits.length > 0 ? Math.max(...habits.map(h => h.streak)) : 0,
      sessions,
      // True only if every habit is completed today
      allHabitsToday: habits.length > 0 && habits.every(h => h.completedToday),
    };
    const currentlyUnlocked = badges.filter(b => b.condition(stats)).map(b => b.id);
    // First run after page load
    if (previouslyUnlockedIds.current === null) {
      previouslyUnlockedIds.current = currentlyUnlocked;
      return;
    }
    const newlyUnlocked = currentlyUnlocked.filter(id => !previouslyUnlockedIds.current.includes(id));
    if (newlyUnlocked.length > 0) {
      const badge = badges.find(b => b.id === newlyUnlocked[0]);
      if (badge) {
        setNewlyUnlockedBadge(badge);
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.5 },
          colors: ['#ffd700', '#ffae42', '#378ADD', '#90cdf4', '#ffffff']
        });
      }
    }
    previouslyUnlockedIds.current = currentlyUnlocked;
  }, [tasks, habits, sessions, loading]);
  const updateLocalTasks = (newTasks) => {
    setTasks(newTasks);
    setLocalTasks(newTasks);
  };
  const updateLocalHabits = (newHabits) => {
    setHabits(newHabits);
    setLocalHabits(newHabits);
  };
  // --- ACTIONS HANDLERS ---
  const logout = async () => {
    await supabase.auth.signOut();
  };
  // Add Task
  const addTask = async (newTask) => {
    
    if (user) {
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          user_id: user.id,
          title: newTask.text,
          priority: newTask.priority,
          completed: false,
          category: newTask.category || 'General'
        })
        .select()
        .single();
        //add it to the state
        
      if (!error && data) {
        setTasks(prev => [...prev, {
          id: data.id,
          text: data.title,
          priority: data.priority,
          completed: data.completed,
          category: data.category || 'General',
          createdAt: data.created_at
        }]);
      }
      
    } else {
      const added = [...tasks, newTask];
      updateLocalTasks(added);
    }
  };
  // Toggle Task Completion
  const completeTask = async (id) => {
    const updated = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    if (user) {
      const target = tasks.find(t => t.id === id);
      if (target) {
        setTasks(updated); // Optimistic UI update
        const { error } = await supabase.from('tasks').update({ completed: !target.completed }).eq('id', id);
        if (error) fetchSupabaseData(user.id);
      }
    } else {
      updateLocalTasks(updated);
    }
  };
  // Delete Task
  const deleteTask = async (id) => {
    const filtered = tasks.filter(t => t.id !== id);
    if (user) {
      setTasks(filtered);
      const { error } = await supabase.from('tasks').delete().eq('id', id);
      if (error) fetchSupabaseData(user.id);
    } else {
      updateLocalTasks(filtered);
    }
  };
  // Add Habit
  const addHabit = async (newHabit) => {
    if (user) {
      const { data, error } = await supabase
        .from('habits')
        .insert({
          user_id: user.id,
          name: newHabit.name,
          streak: 0,
          completed_today: false
        })
        .select()
        .single();
      if (!error && data) {
        setHabits(prev => [...prev, {
          id: data.id,
          name: data.name,
          streak: data.streak,
          completedToday: data.completed_today,
          lastDone: data.last_done
        }]);
      }
    } else {
      const added = [...habits, newHabit];
      updateLocalHabits(added);
    }
  };
  // Complete Habit (Handles Streaks)
  const completeHabit = async (id) => {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    const target = habits.find(h => h.id === id);
    if (!target || target.completedToday) return;
    const streakContinues = target.lastDone === yesterdayStr;
    const nextStreak = streakContinues ? target.streak + 1 : 1;
    const updated = habits.map(h => h.id === id ? { ...h, completedToday: true, lastDone: today, streak: nextStreak } : h);
    if (user) {
      setHabits(updated);
      const { error } = await supabase
        .from('habits')
        .update({ completed_today: true, last_done: today, streak: nextStreak })
        .eq('id', id);
      if (error) fetchSupabaseData(user.id);
    } else {
      updateLocalHabits(updated);
    }
  };
  // Delete Habit
  const deleteHabit = async (id) => {
    const filtered = habits.filter(h => h.id !== id);
    if (user) {
      setHabits(filtered);
      const { error } = await supabase.from('habits').delete().eq('id', id);
      if (error) fetchSupabaseData(user.id);
    } else {
      updateLocalHabits(filtered);
    }
  };
  // Log Pomodoro Sessions
  const logFocusSession = async () => {
    const today = new Date().toISOString().split('T')[0];
    if (user) {
      const { data, error } = await supabase
        .from('focus_sessions')
        .insert({ user_id: user.id, duration_minutes: 25 })
        .select()
        .single();
      if (!error && data) {
        setSessions(prev => prev + 1);
        setDailyFocusLog(prev => ({ ...prev, [today]: (prev[today] || 0) + 1 }));
      }
    } else {
      const nextSessions = localSessions + 1;
      setLocalSessions(nextSessions);
      localStorage.setItem('focusSessions', nextSessions);
      const log = { ...localDailyLog };
      log[today] = (log[today] || 0) + 1;
      setLocalDailyLog(log);
      localStorage.setItem('focusDailyLog', JSON.stringify(log));
      setSessions(nextSessions);
      setDailyFocusLog(log);
    }
  };
  // Add Weekly Task
  const addWeeklyTask = async (day, text) => {
    const weekStart = getWeekStart();
    if (user) {
      const { data, error } = await supabase
        .from('weekly_tasks')
        .insert({ user_id: user.id, week_start: weekStart, day_of_week: day, text, done: false })
        .select()
        .single();
      if (!error && data) {
        setWeeklyTasks(prev => ({
          ...prev,
          [day]: [...(prev[day] || []), { id: data.id, text: data.text, done: data.done }]
        }));
      }
    } else {
      const newTask = { id: Date.now(), text, done: false };
      const updated = { ...weeklyTasks, [day]: [...(weeklyTasks[day] || []), newTask] };
      setWeeklyTasks(updated);
      setLocalWeeklyTasks(updated);
    }
  };
  // Toggle Weekly Task
  const toggleWeeklyTask = async (day, id) => {
    const dayTasks = weeklyTasks[day] || [];
    const target = dayTasks.find(t => t.id === id);
    if (!target) return;
    const updated = {
      ...weeklyTasks,
      [day]: dayTasks.map(t => t.id === id ? { ...t, done: !t.done } : t)
    };
    setWeeklyTasks(updated);
    if (user) {
      const { error } = await supabase.from('weekly_tasks').update({ done: !target.done }).eq('id', id);
      if (error) fetchSupabaseData(user.id);
    } else {
      setLocalWeeklyTasks(updated);
    }
  };
  // Delete Weekly Task
  const deleteWeeklyTask = async (day, id) => {
    const dayTasks = weeklyTasks[day] || [];
    const updated = { ...weeklyTasks, [day]: dayTasks.filter(t => t.id !== id) };
    setWeeklyTasks(updated);
    if (user) {
      const { error } = await supabase.from('weekly_tasks').delete().eq('id', id);
      if (error) fetchSupabaseData(user.id);
    } else {
      setLocalWeeklyTasks(updated);
    }
  };
  // Save Weekly Goal and Reward (Upsert Row)
  const saveWeeklyGoalAndReward = async (goalText, rewardText) => {
    const weekStart = getWeekStart();
    setWeeklyGoal(goalText);
    setWeeklyReward(rewardText);
    if (user) {
      const { data, error } = await supabase
        .from('weekly_goals')//upsert-if row exist update else insert
        .upsert({ user_id: user.id, week_start: weekStart, goal: goalText, reward: rewardText }, { onConflict: 'user_id,week_start' })//onedoal per user,per week
        .select();
      if (error) {
        console.error('Error saving weekly goal:', error);
      } else if (data) {
        setWeeklyHistory(prev => {
          const index = prev.findIndex(item => item.week_start === weekStart);
          if (index !== -1) {
            const updated = [...prev];
            updated[index] = { ...updated[index], goal: goalText, reward: rewardText };
            return updated;
          } else {
            const next = [...prev, data[0]];
            //sort-oldest week first
            return next.sort((a, b) => new Date(a.week_start) - new Date(b.week_start));
          }
        });
      }
    } else {
      setLocalWeeklyGoal(goalText);
      setLocalWeeklyReward(rewardText);
    }
  };
  // Save weekly consistency score
  const logWeeklyConsistencyScore = async (score) => {
    const weekStart = getWeekStart();
    if (user) {
      const { data, error } = await supabase
        .from('weekly_goals')
        .upsert({ user_id: user.id, week_start: weekStart, consistency_score: score }, { onConflict: 'user_id,week_start' })
        .select();
      if (!error && data) {
        setWeeklyHistory(prev => {
          const index = prev.findIndex(item => item.week_start === weekStart);
          if (index !== -1) {
            const updated = [...prev];
            updated[index] = { ...updated[index], consistency_score: score };
            return updated;
          } else {
            const next = [...prev, data[0]];
            return next.sort((a, b) => new Date(a.week_start) - new Date(b.week_start));
          }
        });
      }
    }
  };
  // Clear Weekly Planner
  const resetWeeklyTasks = async () => {
    const cleared = { Mon: [], Tue: [], Wed: [], Thu: [], Fri: [], Sat: [], Sun: [] };
    setWeeklyTasks(cleared);
    setWeeklyGoal('');
    setWeeklyReward('');
    if (user) {
      const weekStart = getWeekStart();
      await supabase.from('weekly_tasks').delete().eq('user_id', user.id).eq('week_start', weekStart);
      await supabase.from('weekly_goals').delete().eq('user_id', user.id).eq('week_start', weekStart);
    } else {
      setLocalWeeklyTasks(cleared);
      setLocalWeeklyGoal('');
      setLocalWeeklyReward('');
    }
  };
  const completedTasks = tasks.filter(t => t.completed).length;
  const completedHabits = habits.filter(h => h.completedToday).length;
  const bestStreak = habits.length > 0 ? Math.max(...habits.map(h => h.streak)) : 0;
  const habitRate = habits.length > 0 ? Math.round((completedHabits / habits.length) * 100) : 0;
  return (
    <UserContext.Provider value={{
      user,
      profile,
      loading,
      logout,
      tasks,
      habits,
      sessions,
      dailyFocusLog,
      weeklyTasks,
      weeklyGoal,
      weeklyReward,
      weeklyHistory,
      newlyUnlockedBadge,
      setNewlyUnlockedBadge,
      addTask,
      completeTask,
      deleteTask,
      addHabit,
      completeHabit,
      deleteHabit,
      logFocusSession,
      addWeeklyTask,
      toggleWeeklyTask,
      deleteWeeklyTask,
      saveWeeklyGoalAndReward,
      logWeeklyConsistencyScore,
      resetWeeklyTasks,
      completedTasks,
      completedHabits,
      bestStreak,
      habitRate,
    }}>
      {children}
    </UserContext.Provider>
  );
}
export default UserContext;