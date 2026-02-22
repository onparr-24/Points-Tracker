import { collection, getDocs, doc, getDoc, setDoc, updateDoc, increment, query, where } from 'firebase/firestore'
import { db, auth, getUid } from './firebase'
import { addLocalGame, getLocalGames, updateLocalGame } from './localGames'

const gamesCollection = () => collection(db, 'games')

export async function createGame(gameName, player1Name) {
  if (!gameName) throw new Error('gameName is required')
  if (!player1Name) throw new Error('player1Name is required')

  const ref = doc(db, 'games', gameName)
  const existing = await getDoc(ref)
  if (existing.exists()) {
    throw new Error('A game with that name already exists')
  }

  const uid = getUid() || auth.currentUser?.uid
  if (!uid) throw new Error('Not authenticated')

  const data = {
    gameName,
    owner: uid,
    player1: player1Name,
    player2: null,
    player3: null,
    player4: null,
    points1: 0,
    points2: 0,
    points3: 0,
    points4: 0,
  }

  await setDoc(ref, data)
  addLocalGame({ id: gameName, ...data })
  return { id: gameName }
}

export async function joinGame(gameName, playerName) {
  if (!gameName) throw new Error('gameName is required')
  if (!playerName) throw new Error('playerName is required')

  const ref = doc(db, 'games', gameName)
  const snap = await getDoc(ref)
  if (!snap.exists()) throw new Error('Game not found')

  const data = snap.data()
  const slots = ['player1', 'player2', 'player3', 'player4']

  // Check for duplicate username
  const taken = slots.map(s => data[s]).filter(Boolean)
  if (taken.includes(playerName)) {
    throw new Error('That name is already taken in this game')
  }

  // Find the first empty slot
  const freeSlot = slots.find(s => !data[s])
  if (!freeSlot) throw new Error('This game is full')

  const slotIndex = slots.indexOf(freeSlot) + 1
  await updateDoc(ref, { [freeSlot]: playerName })

  const updated = { id: gameName, ...data, [freeSlot]: playerName }
  // Use updateLocalGame so existing entries get refreshed, addLocalGame for new ones
  const existing = getLocalGames().find(g => g.id === gameName)
  if (existing) {
    updateLocalGame(gameName, { [freeSlot]: playerName })
  } else {
    addLocalGame(updated)
  }
  return { id: gameName, slot: slotIndex }
}

export async function getGames() {
  const uid = getUid() || auth.currentUser?.uid
  if (!uid) throw new Error('Not authenticated')
  const q = query(gamesCollection(), where('owner', '==', uid))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function getGameByName(name) {
  const d = doc(db, 'games', name)
  const snap = await getDoc(d)
  if (!snap.exists()) return null
  const data = { id: snap.id, ...snap.data() }
  const uid = getUid() || auth.currentUser?.uid
  // Only return the game if it belongs to the current user
  if (!uid || data.owner !== uid) return null
  return data
}

export async function updatePlayerPoints(gameId, pointsField, delta) {
  const ref = doc(db, 'games', gameId)
  await updateDoc(ref, { [pointsField]: increment(delta) })
  // Sync localStorage
  const game = getLocalGames().find(g => g.id === gameId)
  if (game) {
    updateLocalGame(gameId, { [pointsField]: (game[pointsField] ?? 0) + delta })
  }
}

export async function fetchGame(gameId) {
  const ref = doc(db, 'games', gameId)
  const snap = await getDoc(ref)
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data() }
}
