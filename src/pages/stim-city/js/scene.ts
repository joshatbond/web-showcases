import * as THREE from 'three'

import { createCamera } from './camera'

export function createScene() {
  // initial scene setup
  const gameWindow = document.querySelector(
    '.render-target'
  ) as HTMLDivElement | null
  if (!gameWindow) throw new Error('game window missing')

  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0x777777)

  const camera = createCamera(gameWindow.offsetWidth / gameWindow.offsetHeight)

  const renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(gameWindow.offsetWidth, gameWindow.offsetHeight)
  gameWindow.appendChild(renderer.domElement)

  const geometry = new THREE.BoxGeometry(1, 1, 1)
  const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
  const mesh = new THREE.Mesh(geometry, material)
  scene.add(mesh)

  function draw() {
    renderer.render(scene, camera.camera)
  }
  function start() {
    renderer.setAnimationLoop(draw)
  }
  function stop() {
    renderer.setAnimationLoop(null)
  }
  function onMouseDown(event: MouseEvent) {
    camera.onMouseDown(event)
  }
  function onMouseMove(event: MouseEvent) {
    camera.onMouseMove(event)
  }
  function onMouseUp(event: MouseEvent) {
    camera.onMouseUp(event)
  }

  return { onMouseDown, onMouseMove, onMouseUp, start, stop }
}
