import React, { useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Modal from '@mui/material/Modal'
import TextField from '@mui/material/TextField'
import '../App.css'
import { joinGame } from '../services/games'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90vw',
  maxWidth: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 3,
  borderRadius: 2,
}

export default function JoinGame({ open, onClose }) {
  const [gameName, setGameName] = useState('')
  const [playerName, setPlayerName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleJoin = async () => {
    if (!gameName || !playerName) return
    setLoading(true)
    setError('')
    try {
      await joinGame(gameName, playerName)
      onClose()
    } catch (err) {
      setError(err?.message || 'Failed to join game')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      open={!!open}
      onClose={onClose}
      aria-labelledby="join-modal-title"
    >
      <Box sx={style}>
        <Typography id="join-modal-title" variant="h6" component="h2">
          Join Game
        </Typography>
        <Typography sx={{ mt: 2 }}>
          Enter the game name and your player name to join.
        </Typography>

        <div style={{ marginTop: 12 }}>
          <TextField
            label="Game Name"
            value={gameName}
            onChange={e => setGameName(e.target.value)}
            fullWidth
            size="small"
            sx={{ mb: 1 }}
          />
          <TextField
            label="Your Name"
            value={playerName}
            onChange={e => setPlayerName(e.target.value)}
            fullWidth
            size="small"
            sx={{ mb: 1 }}
          />
          {error && (
            <Typography color="error" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}
        </div>

        <div style={{ marginTop: 16, textAlign: 'right' }}>
          <Button onClick={onClose} disabled={loading}>
            Close
          </Button>
          <Button
            variant="contained"
            sx={{ ml: 1 }}
            onClick={handleJoin}
            disabled={loading || !gameName || !playerName}
          >
            {loading ? 'Joining...' : 'Join'}
          </Button>
        </div>
      </Box>
    </Modal>
  )
}
