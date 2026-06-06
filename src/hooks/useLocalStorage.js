import { useState, useEffect } from "react";

function useLocalStorage(key, initialValue) { //mounts only oce: create a component and put on screen for sirts time
    const [value, setValue] = useState(() => {
        try {
            const stored = localStorage.getItem(key);
            if (stored === null) return initialValue;
            return JSON.parse(stored); //so localstorage only stores strings and this converts it back to js object
        } catch {
            // if JSON.parse fails (plain string like "dark"), return as-is
            return localStorage.getItem(key) ?? initialValue;
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch {
            localStorage.setItem(key, value);
        }
    }, [key, value]);//runs whenever key or value changes

    return [value, setValue]; //return in same shape as usestate for easyuse
}

export default useLocalStorage;