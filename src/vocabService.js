// Seeded random number generator
function seededRandom(seed) {
  const x = Math.sin(seed++) * 10000
  return x - Math.floor(x)
}

// Get ISO week number for a date
function getWeekNumber(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7))
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil(((d - yearStart) / 86400000 + 1) / 7)
}

// Select words based on current week
function selectWeeklyWords(allWords, count) {
  const today = new Date()
  const seed = today.getFullYear() * 100 + getWeekNumber(today)

  const selected = []
  const used = new Set()

  for (let i = 0; i < count; i++) {
    let index
    do {
      index = Math.floor(seededRandom(seed + i) * allWords.length)
    } while (used.has(index))

    used.add(index)
    const entry = allWords[index][1]
    selected.push({
      word: allWords[index][0],
      pos: entry.pos,
      definition: entry.definition
    })
  }

  return selected
}

// Fetch and process dictionary data
let cachedPromise = null

export function getWeeklyWords() {
  if (!cachedPromise) {
    cachedPromise = fetch('/dictionary.json')
      .then(res => res.json())
      .then(dictionary => {
        const allWords = Object.entries(dictionary)
        return selectWeeklyWords(allWords, 10)
      })
  }
  return cachedPromise
}
