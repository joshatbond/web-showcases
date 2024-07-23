import * as THREE from 'three'

import { createCamera } from './camera'
import type { createCity } from './city'
import { Controls } from './controls'

export function createScene() {
  // initial scene setup
  const gameWindow = document.querySelector(
    '.render-target'
  ) as HTMLDivElement | null
  if (!gameWindow) throw new Error('game window missing')

  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0x777777)

  const controls = new Controls()
  const camera = createCamera(
    gameWindow.offsetWidth / gameWindow.offsetHeight,
    controls
  )

  const renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(gameWindow.offsetWidth, gameWindow.offsetHeight)
  gameWindow.appendChild(renderer.domElement)

  const geometry = new THREE.BoxGeometry(1, 1, 1)
  const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
  const mesh = new THREE.Mesh(geometry, material)
  scene.add(mesh)
  function draw() {
    renderer.render(scene, camera)
  }
  function start() {
    renderer.setAnimationLoop(draw)
  }
  function stop() {
    renderer.setAnimationLoop(null)
  }

  return { start, stop }
}
