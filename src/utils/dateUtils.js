// date helpers used across multiple components
// keeps date logic in one place

// "2026-06-06" → "Jun 6"
export const formatDate = (isoString) => {
    return new Date(isoString).toLocaleDateString('en-US', {
        month: 'short',
        day:   'numeric'
    })
}

// returns today as "2026-06-06"
export const today = () => {
    return new Date().toISOString().split('T')[0]
}

// returns yesterday as "2026-06-05"
export const yesterday = () => {
    const d = new Date()
    d.setDate(d.getDate() - 1)
    return d.toISOString().split('T')[0]
}

// builds array of last N days as date strings
// used in heatmap and charts
export const lastNDays = (n) => {
    return Array.from({ length: n }, (_, i) => {
        const d = new Date()
        d.setDate(d.getDate() - (n - 1 - i))
        return d.toISOString().split('T')[0]
    })
}

// "2026-06-06" → "Mon"
export const dayLabel = (isoDate) => {
    return new Date(isoDate).toLocaleDateString('en-US', { weekday: 'short' })
}