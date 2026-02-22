import React, { useState } from 'react'
import '../App.css'
import CreateGame from '../Components/Create Game'
import JoinGame from '../Components/Join Game'
import ViewGame from '../Components/View Game'

export default function Home() {
  const [createOpen, setCreateOpen] = useState(false)
  const [joinOpen, setJoinOpen] = useState(false)
  const [viewOpen, setViewOpen] = useState(false)

  return (
    <div className="home-container">
      <h1>Points Tracker</h1>
      <p>Welcome — choose an action to get started.</p>
      <div className="home-actions">
        <button className="primary" onClick={() => setCreateOpen(true)}>
          Create Game
        </button>
        <button onClick={() => setViewOpen(true)}>View Game</button>
        <button onClick={() => setJoinOpen(true)}>Join Game</button>
      </div>
      <CreateGame open={createOpen} onClose={() => setCreateOpen(false)} />
      <JoinGame open={joinOpen} onClose={() => setJoinOpen(false)} />
      <ViewGame open={viewOpen} onClose={() => setViewOpen(false)} />
    </div>
  )
}
