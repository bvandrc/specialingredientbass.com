import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'

declare global {
  interface Window {
    dataLayer: unknown[]
  }
}

window.dataLayer = window.dataLayer || []

function gtag(...args: unknown[]) {
  window.dataLayer.push(args)
}

gtag('js', new Date())
gtag('config', 'G-VSJMFQV9LJ')

// biome-ignore lint/style/noNonNullAssertion: root is always present
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
