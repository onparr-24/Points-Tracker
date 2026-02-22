import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { getLocalGames } from '../services/localGames'
import { updatePlayerPoints } from '../services/games'
import '../App.css'

const RANK_STYLES = [
  { label: '1st', color: '#f5c542', bg: 'rgba(245,197,66,0.12)' },
  { label: '2nd', color: '#c0c0c0', bg: 'rgba(192,192,192,0.10)' },
  { label: '3rd', color: '#cd7f32', bg: 'rgba(205,127,50,0.10)' },
  { label: '4th', color: '#6b7280', bg: 'rgba(107,114,128,0.08)' },
]

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90vw',
  maxWidth: 340,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 3,
  borderRadius: 2,
}

export default function Game() {
  const { id } = useParams()
  const navigate = useNavigate()
  const gameId = decodeURIComponent(id)

  const found = getLocalGames().find(g => g.id === gameId)
  const [game, setGame] = useState(found || null)
  const [modal, setModal] = useState({ open: false, playerName: '', pointsField: '', mode: 'add' })
  const [inputValue, setInputValue] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  if (!game) {
    return (
      <div className="game-page">
        <h2>Game not found</h2>
        <button className="back-btn" onClick={() => navigate('/')}>← Back to Home</button>
      </div>
    )
  }

  const players = [
    { name: game.player1, points: game.points1 ?? 0, pointsField: 'points1' },
    { name: game.player2, points: game.points2 ?? 0, pointsField: 'points2' },
    { name: game.player3, points: game.points3 ?? 0, pointsField: 'points3' },
    { name: game.player4, points: game.points4 ?? 0, pointsField: 'points4' },
  ]
    .filter(p => p.name)
    .sort((a, b) => b.points - a.points)

  const openModal = (playerName, pointsField, mode) => {
    setModal({ open: true, playerName, pointsField, mode })
    setInputValue('')
    setError('')
  }

  const handleSubmit = async () => {
    const num = parseFloat(parseFloat(inputValue).toFixed(3))
    if (isNaN(num) || num <= 0) {
      setError('Please enter a positive number (up to 3 decimal places)')
      return
    }
    setSubmitting(true)
    try {
      const delta = modal.mode === 'add' ? num : -num
      await updatePlayerPoints(gameId, modal.pointsField, delta)
      setGame(prev => ({ ...prev, [modal.pointsField]: (prev[modal.pointsField] ?? 0) + delta }))
      setModal(m => ({ ...m, open: false }))
    } catch (err) {
      setError(err?.message || 'Failed to update points')
    } finally {
      setSubmitting(false)
    }
  }

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
            <div key={player.pointsField} className="scoreboard-row" style={{ background: rank.bg }}>
              <div className="rank-badge" style={{ color: rank.color }}>{rank.label}</div>
              <div className="player-name">{player.name}</div>
              <div className="points-controls">
                <button className="points-btn minus" onClick={() => openModal(player.name, player.pointsField, 'subtract')}>−</button>
                <span className="player-points" style={{ color: rank.color }}>{parseFloat((player.points ?? 0).toFixed(3))}</span>
                <button className="points-btn plus" onClick={() => openModal(player.name, player.pointsField, 'add')}>+</button>
              </div>
            </div>
          )
        })}
      </div>

      <Modal open={modal.open} onClose={() => setModal(m => ({ ...m, open: false }))} aria-labelledby="points-modal-title">
        <Box sx={modalStyle}>
          <Typography id="points-modal-title" variant="h6" sx={{ mb: 1 }}>
            {modal.mode === 'add' ? 'Add Points' : 'Subtract Points'} — {modal.playerName}
          </Typography>
          <TextField
            autoFocus
            label="Points"
            type="number"
            inputProps={{ min: 0.001, step: 0.001 }}
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            fullWidth
            size="small"
            sx={{ mt: 1 }}
          />
          {error && <Typography color="error" sx={{ mt: 1, fontSize: '0.85rem' }}>{error}</Typography>}
          <div style={{ marginTop: 16, textAlign: 'right' }}>
            <Button onClick={() => setModal(m => ({ ...m, open: false }))} disabled={submitting}>Cancel</Button>
            <Button variant="contained" sx={{ ml: 1 }} onClick={handleSubmit} disabled={submitting || !inputValue}>
              {submitting ? 'Saving...' : 'Submit'}
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  )
}

