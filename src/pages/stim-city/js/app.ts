import { createScene } from './scene'

window.onload = () => {
  window.scene = createScene()
  window.scene.start()
}
