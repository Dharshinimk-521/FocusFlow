import { useState, useEffect, useRef } from "react";
//useRef is a React Hook that gives you a container whose value can survive re-renders without
// causing new renders. it can be used with Dom ELE LIKE const ref=useRef(), ref.current.focus
//re-render:runs the component func again to update what should appear on the screen 

function useTimer(initialSeconds = 25 * 60) { //default 25 mins
    const [timeLeft, setTimeLeft] = useState(initialSeconds);
    const [isRunning, setIsRunning] = useState(false);
    const [sessions, setSessions] = useState(
        () => Number(localStorage.getItem("focusSessions")) || 0
    );
    const intervalRef = useRef(null);//holds the interval ID

    useEffect(() => {
        if (!isRunning) return;

        intervalRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(intervalRef.current);
                    setIsRunning(false);

                    setSessions(prevSessions => {
                        const next = prevSessions + 1;
                        localStorage.setItem("focusSessions", next);
                        // inside useTimer, where sessions increment
                        const today = new Date().toISOString().split('T')[0]
                        const dailyLog = JSON.parse(localStorage.getItem('focusDailyLog') || '{}')
                        dailyLog[today] = (dailyLog[today] || 0) + 1
                        localStorage.setItem('focusDailyLog', JSON.stringify(dailyLog))
                        return next;
                    });

                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        // cleanup — critical for useEffect with setInterval
        return () => clearInterval(intervalRef.current);
    }, [isRunning]); // only reruns when isRunning chnages

    const start  = () => setIsRunning(true);
    const pause  = () => setIsRunning(false);
    const reset  = () => {
        setIsRunning(false);
        setTimeLeft(initialSeconds);
    };
    
    const short = () => {
        setIsRunning(false);
        clearInterval(intervalRef.current)
        setTimeLeft(5*60);
    }
    const long=() =>{
        setIsRunning(false);
        clearInterval(intervalRef.current);  // stop any running timer
        setTimeLeft(15 * 60);
    }
    const focus = () => {
    setIsRunning(false);
    clearInterval(intervalRef.current);  // back to focus mode
    setTimeLeft(initialSeconds);         // back to 25 min default
}

    // format 1500 → "25:00"
    const format = (secs) => {
        const m = String(Math.floor(secs / 60)).padStart(2, "0"); //get mins, pad to "05"
        const s = String(secs % 60).padStart(2, "0");//get remaining secs
        return `${m}:${s}`;
    };

    return {
        timeLeft,
        isRunning,
        sessions,
        display: format(timeLeft),
        start,
        pause,
        reset,
        short,
        long,
        focus
    };
}

export default useTimer;