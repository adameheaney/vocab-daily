import { use, Suspense } from 'react'
import VocabPage from './VocabPage'
import { getWeeklyWords } from './vocabService'
import './App.css'

function VocabContent() {
  const words = use(getWeeklyWords())
  return <VocabPage words={words} />
}

function App() {
  return (
    <Suspense fallback={
      <div className="app">
        <div className="container">
          <p className="loading">Loading this week's vocabulary...</p>
        </div>
      </div>
    }>
      <VocabContent />
    </Suspense>
  )
}

export default App
