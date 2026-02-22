import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Timestamped startup log to detect caching/HMR issues — will change each edit
// eslint-disable-next-line no-console
console.log('app bundle loaded at', new Date().toISOString())

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
