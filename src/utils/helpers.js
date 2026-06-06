// small general purpose helpers

// 1500 → "25:00"
export const formatTime = (secs) => {
    const m = String(Math.floor(secs / 60)).padStart(2, '0')
    const s = String(secs % 60).padStart(2, '0')
    return `${m}:${s}`
}

// [1,2,3,4,5] → random item
export const randomFrom = (arr) => {
    return arr[Math.floor(Math.random() * arr.length)]
}

// 0.756 → "76%"
export const toPercent = (decimal) => {
    return `${Math.round(decimal * 100)}%`
}

// clamp a number between min and max
export const clamp = (val, min, max) => {
    return Math.min(Math.max(val, min), max)
}