import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getLocalGames } from '../services/localGames'
import '../App.css'

const RANK_STYLES = [
  { label: '1st', color: '#f5c542', bg: 'rgba(245,197,66,0.12)' },
  { label: '2nd', color: '#c0c0c0', bg: 'rgba(192,192,192,0.10)' },
  { label: '3rd', color: '#cd7f32', bg: 'rgba(205,127,50,0.10)' },
  { label: '4th', color: '#6b7280', bg: 'rgba(107,114,128,0.08)' },
]

export default function Game() {
  const { id } = useParams()
  const navigate = useNavigate()
  const gameId = decodeURIComponent(id)

  const games = getLocalGames()
  const game = games.find(g => g.id === gameId)

  if (!game) {
    return (
      <div className="game-page">
        <h2>Game not found</h2>
        <button className="back-btn" onClick={() => navigate('/')}>← Back to Home</button>
      </div>
    )
  }

  const players = [
    { name: game.player1, points: game.points1 ?? 0 },
    { name: game.player2, points: game.points2 ?? 0 },
    { name: game.player3, points: game.points3 ?? 0 },
    { name: game.player4, points: game.points4 ?? 0 },
  ]
    .filter(p => p.name)
    .sort((a, b) => b.points - a.points)

  return (
    <div className="game-page">
      <div className="game-header">
        <button className="back-btn" onClick={() => navigate('/')}>← Back</button>
        <div className="game-title-block">
          <h1 className="game-title">{game.gameName || game.id}</h1>
          <span className="game-subtitle">{players.length} player{players.length !== 1 ? 's' : ''}</span>
        </div>
      </div>

      <div className="scoreboard">
        {players.map((player, i) => {
          const rank = RANK_STYLES[i] || RANK_STYLES[3]
          return (
            <div key={i} className="scoreboard-row" style={{ background: rank.bg }}>
              <div className="rank-badge" style={{ color: rank.color }}>{rank.label}</div>
              <div className="player-name">{player.name}</div>
              <div className="player-points" style={{ color: rank.color }}>{player.points}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
