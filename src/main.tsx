import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import ReactGA from 'react-ga4'
import { App } from './App'

// Only the deployed site reports to GA — local dev/preview and the CI
// Playwright runs would otherwise show up as real traffic.
if (window.location.hostname === 'specialingredientbass.com') {
  ReactGA.initialize('G-VSJMFQV9LJ')
}

// biome-ignore lint/style/noNonNullAssertion: root is always present
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
