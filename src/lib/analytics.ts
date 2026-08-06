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

export {}
