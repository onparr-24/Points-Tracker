import React, { useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Modal from '@mui/material/Modal'
import TextField from '@mui/material/TextField'
import '../App.css'
import { createGame } from '../services/games'

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
};

export default function CreateGame({ open, onClose }) {
  const [gameName, setGameName] = useState('')
  const [player1, setPlayer1] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleCreate = async () => {
    if (!gameName || !player1) return
    setLoading(true)
    setError('')
    try {
      await createGame(gameName, player1)
      onClose()
    } catch (err) {
      console.error('createGame failed (component)', err)
      setError(err?.message || 'Failed to create game')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Modal
        open={!!open}
        onClose={onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Create Game
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Add details for your new game here.
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
              value={player1}
              onChange={e => setPlayer1(e.target.value)}
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
            <Button variant="contained" sx={{ ml: 1 }} onClick={handleCreate} disabled={loading || !gameName || !player1}>
              {loading ? 'Creating...' : 'Create'}
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  )
}