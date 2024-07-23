/// <reference types="astro/client" />
import type { Game } from './pages/stim-city/js/game'

declare global {
  interface Window {
    game: Game
  }
}
