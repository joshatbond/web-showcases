import { createScene } from './scene'

window.onload = () => {
  window.scene = createScene()
  window.addEventListener('mousedown', window.scene.onMouseDown)
  window.addEventListener('mousemove', window.scene.onMouseMove)
  window.addEventListener('mouseup', window.scene.onMouseUp)
  window.addEventListener('contextmenu', event => event.preventDefault())
  window.scene.start()
}
