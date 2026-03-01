const MILLIS_PER_DAY = 86400000

// Seeded random number generator
function seededRandom(seed) {
  const x = Math.sin(seed++) * 10000
  return x - Math.floor(x)
}

// Select words based on current week (changes Saturday night Eastern Time)
function selectWeeklyWords(allWords, count) {
  const now = new Date()
  // Get date parts in Eastern Time (handles both EST UTC-5 and EDT UTC-4)
  const etParts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    weekday: 'long'
  }).formatToParts(now)
  const year = Number(etParts.find(p => p.type === 'year').value)
  const month = Number(etParts.find(p => p.type === 'month').value) - 1
  const day = Number(etParts.find(p => p.type === 'day').value)
  const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const dayOfWeek = weekdays.indexOf(etParts.find(p => p.type === 'weekday').value)
  // Find the Sunday that started this week in Eastern Time
  // (negative days are handled correctly by Date.UTC)
  const weekStart = new Date(Date.UTC(year, month, day - dayOfWeek))
  const startOfYear = new Date(Date.UTC(weekStart.getUTCFullYear(), 0, 1))
  const seed = weekStart.getUTCFullYear() * 1000 +
    Math.floor((weekStart - startOfYear) / MILLIS_PER_DAY)

  const selected = []
  const used = new Set()

  for (let i = 0; i < count; i++) {
    let index
    do {
      index = Math.floor(seededRandom(seed + i * 1000) * allWords.length)
    } while (used.has(index))

    used.add(index)
    const entry = allWords[index][1]
    selected.push({
      word: allWords[index][0],
      pos: entry.pos,
      definition: entry.definition,
      examples: entry.examples || [],
      metaphor: entry.metaphor || null
    })
  }

  return selected
}

// Fetch and process dictionary data
let cachedPromise = null

export function getWeeklyWords() {
  if (!cachedPromise) {
    cachedPromise = fetch(`${import.meta.env.BASE_URL}dictionary.json`)
      .then(res => res.json())
      .then(dictionary => {
        const allWords = Object.entries(dictionary)
        return selectWeeklyWords(allWords, 10)
      })
  }
  return cachedPromise
}
