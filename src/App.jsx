import { use, Suspense } from 'react'
import VocabPage from './VocabPage'
import { getWeeklyWords } from './vocabService'
import './App.css'

function VocabContent() {
  const words = use(getWeeklyWords())
  return <VocabPage words={words} />
}

function SkeletonFallback() {
  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <p className="header-label">Vocab for the week of</p>
          <div className="skeleton-line skeleton-title" />
        </header>
        <div className="accordion">
          {Array.from({ length: 10 }, (_, i) => (
            <div key={i} className="accordion-item">
              <div className="accordion-header">
                <div className="skeleton-line skeleton-word" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <Suspense fallback={<SkeletonFallback />}>
      <VocabContent />
    </Suspense>
  )
}

export default App
