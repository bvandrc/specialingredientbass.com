import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import ReactGA from 'react-ga4'
import { App } from './App'

// Set only by the deploy workflow. `import.meta.env.PROD` won't do: CI builds
// the same way to run Playwright against it, and that traffic isn't real.
if (import.meta.env.VITE_ENABLE_ANALYTICS === 'true') {
  ReactGA.initialize('G-VSJMFQV9LJ')
}

// biome-ignore lint/style/noNonNullAssertion: root is always present
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
