import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'

// for iphone window
const setAppHeight = () =>
  document.documentElement.style.setProperty(
    '--app-height',
    `${window.innerHeight}px`,
  )
window.addEventListener('resize', setAppHeight)
setAppHeight()

// biome-ignore lint/style/noNonNullAssertion: root is always present
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
