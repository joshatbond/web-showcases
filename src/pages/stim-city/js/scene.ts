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

  let meshes: THREE.Mesh[][] = []

  function initialize({ data: city }: ReturnType<typeof createCity>) {
    scene.clear()
    meshes = []

    for (let x = 0; x < city.length; x++) {
      const column: THREE.Mesh[] = []

      for (let y = 0; y < city.length; y++) {
        // terrain
        const geometry = new THREE.BoxGeometry(1, 1, 1)
        const material = new THREE.MeshLambertMaterial({ color: 0x00aa00 })
        const mesh = new THREE.Mesh(geometry, material)
        mesh.position.set(x, -0.5, y)

        scene.add(mesh)

        column.push(mesh)

        // buildings
        const tile = city[x][y]
        if (tile.building === 'building') {
          const buildingGeometry = new THREE.BoxGeometry(1, 1, 1)
          const buildingMaterial = new THREE.MeshLambertMaterial({
            color: 0x777777,
          })
          const buildingMesh = new THREE.Mesh(
            buildingGeometry,
            buildingMaterial
          )
          buildingMesh.position.set(x, 0.5, y)

          scene.add(buildingMesh)
        }

        column.push(mesh)
      }

      meshes.push(column)
    }

    setupLights()
  }

  function setupLights() {
    const lights = [
      new THREE.AmbientLight(0xffffff, 0.2),
      new THREE.DirectionalLight(0xffffff, 0.3),
      new THREE.DirectionalLight(0xffffff, 0.3),
      new THREE.DirectionalLight(0xffffff, 0.3),
    ]
    lights[1].position.set(0, 1, 0)
    lights[2].position.set(1, 1, 0)
    lights[3].position.set(0, 1, 1)

    scene.add(...lights)
  }

  function draw() {
    renderer.render(scene, camera)
  }
  function start() {
    renderer.setAnimationLoop(draw)
  }
  function stop() {
    renderer.setAnimationLoop(null)
  }

  return { initialize, start, stop }
}
