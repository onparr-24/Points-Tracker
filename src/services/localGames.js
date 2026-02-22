const STORAGE_KEY = 'local_games'

/** Returns the locally stored games array. */
export function getLocalGames() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

/** Adds a game object to the local array (skips duplicates by id). */
export function addLocalGame(game) {
  const games = getLocalGames()
  if (games.some(g => g.id === game.id)) return games
  const updated = [...games, game]
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  return updated
}

/** Removes a game by id from the local array. */
export function removeLocalGame(id) {
  const updated = getLocalGames().filter(g => g.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  return updated
}

/** Replaces the entire local games array. */
export function setLocalGames(games) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(games))
}

/** Merges partial updates into an existing game by id. */
export function updateLocalGame(id, updates) {
  const games = getLocalGames()
  const updated = games.map(g => g.id === id ? { ...g, ...updates } : g)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  return updated
}
