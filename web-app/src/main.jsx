import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Suppress Firebase offline profile check messages
const originalWarn = console.warn
const originalLog = console.log

console.warn = function(...args) {
  const msg = args[0]?.toString?.()?.toLowerCase?.() || ''
  // Filter out known Firebase offline warnings
  if (msg.includes('profile check') || msg.includes('database not found') || msg.includes('does not exist')) {
    return
  }
  originalWarn.apply(console, args)
}

console.log = function(...args) {
  const msg = args[0]?.toString?.()?.toLowerCase?.() || ''
  if (msg.includes('profile check skipped while offline')) {
    return
  }
  originalLog.apply(console, args)
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
