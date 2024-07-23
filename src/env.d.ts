/// <reference types="astro/client" />
import { createScene } from './pages/sim-city/js/scene'

declare global {
  interface Window {
    scene: ReturnType<typeof createScene>
  }
}
