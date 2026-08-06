import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './lib/analytics'
import { App } from './App'

// soundcloud-widget expects a Node-style `global`.
declare global {
  interface Window {
    global: Window
  }
}
window.global ||= window

// biome-ignore lint/style/noNonNullAssertion: root is always present
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
