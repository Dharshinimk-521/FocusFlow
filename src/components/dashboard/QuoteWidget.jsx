// fetches a random quote from quotable API on mount

import { useState, useEffect } from 'react'
import quotes from '../../data/quotes'
function QuoteWidget() {
    const saved = localStorage.getItem('dailyQuote')
    const savedDate = localStorage.getItem('dailyQuoteDate')
    const today = new Date().toISOString().split('T')[0]
    const cachedQuote =
    saved && savedDate === today ? JSON.parse(saved) : null
    const [quote, setQuote]   = useState(cachedQuote)
    const [loading, setLoading] = useState(!cachedQuote)

    useEffect(() => {
    if (quote) return

    fetch('https://api.allorigins.win/get?url=' + encodeURIComponent('https://zenquotes.io/api/random'))
        .then(res => res.json())
        .then(data => {
            const parsed = JSON.parse(data.contents)  // allorigins wraps response in .contents
            const q = {
                content: parsed[0].q,   // zenquotes uses .q for quote
                author:  parsed[0].a    // and .a for author
            }
            localStorage.setItem('dailyQuote', JSON.stringify(q))
            localStorage.setItem('dailyQuoteDate', today)
            setQuote(q)
            setLoading(false)
        })
        .catch(() => {
            const random = quotes[Math.floor(Math.random() * quotes.length)]
            setQuote(random)
            setLoading(false)
        })
}, [])

    if (loading) return (
        <div className="dash-card quote-card">
            <span className="dash-card-lbl">Loading quote...</span>
        </div>
    )

    return (
        <div className="dash-card quote-card">
            <div className="quote-mark">"</div>
            <p className="quote-text">{quote.content}</p>
            <div className="quote-author">— {quote.author}</div>
        </div>
    )
}

export default QuoteWidget;
//checkk