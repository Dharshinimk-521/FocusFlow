import { useState, useEffect } from "react";

function useTheme() {
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem("theme") || "dark";
    });

    useEffect(() => {
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev =>
            prev === "dark" ? "light" : "dark"
        );
    };

    return {
        theme,
        toggleTheme
    };
}

export default useTheme;