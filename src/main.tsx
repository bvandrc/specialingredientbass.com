import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './lib/analytics'
import { App } from './App'

// biome-ignore lint/style/noNonNullAssertion: root is always present
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
