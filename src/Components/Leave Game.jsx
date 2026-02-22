import React, { useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Modal from '@mui/material/Modal'
import TextField from '@mui/material/TextField'
import { getLocalGames, removeLocalGame } from '../services/localGames'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90vw',
  maxWidth: 400,
  bgcolor: 'background.paper',
  color: 'rgba(0,0,0,0.87)',
  border: '2px solid #000',
  boxShadow: 24,
  p: 3,
  borderRadius: 2,
}

export default function LeaveGame({ open, onClose }) {
  const [gameName, setGameName] = useState('')
  const [error, setError] = useState('')

  const handleLeave = () => {
    const games = getLocalGames()
    const exists = games.some(g => g.id === gameName || g.gameName === gameName)
    if (!exists) {
      setError('No saved game found with that name.')
      return
    }
    const match = games.find(g => g.id === gameName || g.gameName === gameName)
    removeLocalGame(match.id)
    setGameName('')
    setError('')
    onClose()
  }

  const handleClose = () => {
    setGameName('')
    setError('')
    onClose()
  }

  return (
    <Modal open={!!open} onClose={handleClose} aria-labelledby="leave-modal-title">
      <Box sx={style}>
        <Typography id="leave-modal-title" variant="h6" component="h2">
          Leave Game
        </Typography>
        <Typography sx={{ mt: 1, mb: 2, fontSize: '0.9rem', color: 'text.secondary' }}>
          Enter the game name to remove it from your saved games.
        </Typography>

        <TextField
          autoFocus
          label="Game Name"
          value={gameName}
          onChange={e => { setGameName(e.target.value); setError('') }}
          onKeyDown={e => e.key === 'Enter' && handleLeave()}
          fullWidth
          size="small"
        />
        {error && (
          <Typography color="error" sx={{ mt: 1, fontSize: '0.85rem' }}>
            {error}
          </Typography>
        )}

        <div style={{ marginTop: 16, textAlign: 'right' }}>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            sx={{ ml: 1 }}
            onClick={handleLeave}
            disabled={!gameName}
          >
            Leave
          </Button>
        </div>
      </Box>
    </Modal>
  )
}
