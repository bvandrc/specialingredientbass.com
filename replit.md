# Special Ingredient Bass - DJ Website

## Overview
React website for DJ Special Ingredient, featuring custom SoundCloud players and social media integration. Built with React 18, Vite 5, and TypeScript.

## Project Architecture
- **Framework**: React 18 + Vite 5
- **Language**: TypeScript
- **Styling**: CSS with PostCSS + Autoprefixer
- **Package Manager**: Yarn
- **Linter**: Biome

## Project Structure
- `src/` - Main application source
  - `components/` - React components (Header, MainGridBody, SoundcloudPlayer, etc.)
  - `api/` - API utilities (SoundCloud integration)
  - `styles/` - CSS stylesheets
  - `constants/` - Static data (grid card content)
  - `hooks/` - Custom React hooks
  - `utils/` - Utility functions
- `public/` - Static assets (favicon, logo, preview image)
- `spotify-tools/` - Spotify playlist generation utilities
- `soundcloud-data.json` - Pre-fetched SoundCloud oEmbed data (generated at build time)

## Key Configuration
- Vite dev server runs on port 5000 (host: 0.0.0.0, allowedHosts: true for Replit)
- Build outputs to `dist/` directory
- SoundCloud oEmbed data is fetched during Vite config initialization

## Scripts
- `yarn dev` - Start dev server
- `yarn build` - Production build
- `yarn lint` - Run Biome linting + TypeScript checks
