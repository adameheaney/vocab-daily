import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './App.css'

function formatDefinition(definition) {
  // Split on numbered patterns like "1." "2." etc.
  const parts = definition.split(/(?=\b\d+\.\s)/)

  // If there's only one part or no numbered items, return as-is
  const numbered = parts.filter(p => /^\d+\.\s/.test(p.trim()))
  if (numbered.length <= 1 && parts.length <= 1) {
    return <span>{definition}</span>
  }

  // Separate leading text (before first number) from numbered items
  const leading = parts[0] && !/^\d+\.\s/.test(parts[0].trim()) ? parts[0].trim() : null
  const items = leading ? parts.slice(1) : parts

  return (
    <>
      {leading && <span>{leading} </span>}
      <ol className="definition-list">
        {items.map((item, i) => {
          const text = item.replace(/^\d+\.\s*/, '').trim()
          return <li key={i}>{text}</li>
        })}
      </ol>
    </>
  )
}

function VocabPage({ words }) {
  const [openWord, setOpenWord] = useState(null)
  const [favorites, setFavorites] = useState(() => {
    const stored = localStorage.getItem('vocab-favorites')
    return stored ? JSON.parse(stored) : []
  })
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)

  const toggleAccordion = (word) => {
    setOpenWord(openWord === word ? null : word)
  }

  const toggleFavorite = (e, word) => {
    e.stopPropagation()
    setFavorites(prev => {
      const next = prev.includes(word)
        ? prev.filter(w => w !== word)
        : [...prev, word]
      localStorage.setItem('vocab-favorites', JSON.stringify(next))
      return next
    })
  }

  const getWeekMonday = () => {
    const now = new Date()
    const day = now.getDay()
    const diff = day === 0 ? -6 : 1 - day
    const monday = new Date(now)
    monday.setDate(now.getDate() + diff)
    return monday.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  }

  const displayWords = showFavoritesOnly
    ? words.filter(w => favorites.includes(w.word))
    : words

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <p className="header-label">Vocab for the week of</p>
          <h1>{getWeekMonday()}</h1>
        </header>

        <div className="accordion">
          {displayWords.length === 0 && showFavoritesOnly && (
            <p className="empty-state">No favorited words yet. Tap the star on any word to save it.</p>
          )}
          {displayWords.map((item) => {
            const isOpen = openWord === item.word
            const isFav = favorites.includes(item.word)
            return (
              <motion.div
                key={item.word}
                layout
                transition={{ layout: { duration: 0.3 } }}
                className={`accordion-item ${isOpen ? 'active' : ''}`}
              >
                <button
                  className="accordion-header"
                  onClick={() => toggleAccordion(item.word)}
                >
                  <span className="word">{item.word}</span>
                  <span className="header-actions">
                    <span
                      className={`favorite ${isFav ? 'active' : ''}`}
                      onClick={(e) => toggleFavorite(e, item.word)}
                      role="button"
                      aria-label={isFav ? `Unfavorite ${item.word}` : `Favorite ${item.word}`}
                    >
                      {isFav ? '\u2605' : '\u2606'}
                    </span>
                    <span className="icon">{isOpen ? '\u2212' : '+'}</span>
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      className="accordion-content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                      <div className="definition">
                        <span className="pos">{item.pos}</span>
                        {formatDefinition(item.definition)}
                      </div>
                      {item.examples && item.examples.length > 0 && (
                        <div className="examples">
                          <h4 className="section-label">Examples</h4>
                          {item.examples.map((ex, i) => (
                            <p key={i} className="example-sentence">{ex}</p>
                          ))}
                        </div>
                      )}
                      {item.metaphor && (
                        <div className="metaphor">
                          <h4 className="section-label">Metaphor</h4>
                          <p className="metaphor-sentence">{item.metaphor}</p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>

        <footer className="footer">
          <p>New words every week</p>
        </footer>
      </div>

      <button
        className={`fab ${showFavoritesOnly ? 'fab-active' : ''}`}
        onClick={() => setShowFavoritesOnly(prev => !prev)}
        aria-label={showFavoritesOnly ? 'Show all words' : 'Show favorites only'}
      >
        {showFavoritesOnly ? '\u2605' : '\u2606'}
      </button>
    </div>
  )
}

export default VocabPage
