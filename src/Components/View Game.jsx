import React from 'react'
import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Modal from '@mui/material/Modal'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Divider from '@mui/material/Divider'
import { getLocalGames } from '../services/localGames'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
}

export default function ViewGame({ open, onClose }) {
  const navigate = useNavigate()
  const games = getLocalGames()

  const handleSelect = (gameId) => {
    onClose()
    navigate(`/game/${encodeURIComponent(gameId)}`)
  }

  return (
    <Modal open={!!open} onClose={onClose} aria-labelledby="view-modal-title">
      <Box sx={style}>
        <Typography id="view-modal-title" variant="h6" component="h2">
          Your Games
        </Typography>

        {games.length === 0 ? (
          <Typography sx={{ mt: 2, color: 'text.secondary' }}>
            No saved games found. Create one to get started!
          </Typography>
        ) : (
          <List sx={{ mt: 1 }}>
            {games.map((game, i) => {
              const players = [game.player1, game.player2, game.player3, game.player4]
                .filter(Boolean)
                .join(', ')
              return (
                <React.Fragment key={game.id}>
                  {i > 0 && <Divider />}
                  <ListItemButton onClick={() => handleSelect(game.id)}>
                    <ListItemText
                      primary={game.gameName || game.id}
                      secondary={players || 'No players yet'}
                    />
                  </ListItemButton>
                </React.Fragment>
              )
            })}
          </List>
        )}

        <div style={{ marginTop: 16, textAlign: 'right' }}>
          <Button onClick={onClose}>Close</Button>
        </div>
      </Box>
    </Modal>
  )
}
