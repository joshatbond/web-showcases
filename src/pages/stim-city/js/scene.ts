import * as THREE from 'three'

import { createAssetInstance } from './assets'
import { createCamera } from './camera'
import type { City } from './city'
import { Controls } from './controls'

export class Scene {
  scene: THREE.Scene
  controls: Controls
  camera: THREE.PerspectiveCamera
  renderer: THREE.WebGLRenderer

  terrainMeshes: THREE.Mesh[][] = []
  buildingMeshes: (THREE.Mesh | null)[][] = []

  constructor() {
    const gameWindow = document.querySelector(
      '.render-target'
    ) as HTMLDivElement | null
    if (!gameWindow) throw new Error('game window missing')

    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(0x777777)

    this.controls = new Controls()
    this.camera = createCamera(
      gameWindow.offsetWidth / gameWindow.offsetHeight,
      this.controls
    )

    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.renderer.setSize(gameWindow.offsetWidth, gameWindow.offsetHeight)
    gameWindow.appendChild(this.renderer.domElement)

    this.scene.add(this.camera)
  }

  initialize(city: City) {
    this.scene.clear()
    this.terrainMeshes = []

    for (let x = 0; x < city.data.length; x++) {
      const column: THREE.Mesh[] = []

      for (let y = 0; y < city.data.length; y++) {
        // terrain
        const mesh = createAssetInstance(city.data[x][y].terrainId, x, y)

        if (mesh) {
          this.scene.add(mesh)
          column.push(mesh)
        }
      }

      this.terrainMeshes.push(column)
      this.buildingMeshes.push([...Array(city.size)])
    }

    this.setupLights()
  }
  update(city: City['data']) {
    for (let x = 0; x < city.length; x++) {
      for (let y = 0; y < city.length; y++) {
        const currentBuildingId = this.buildingMeshes[x][y]?.userData.id
        const newBuildingId = city[x][y].buildingId

        if (!newBuildingId && currentBuildingId) {
          this.scene.remove(this.buildingMeshes[x][y]!)
          this.buildingMeshes[x][y] = null
        }
        if (newBuildingId !== currentBuildingId) {
          if (this.buildingMeshes[x][y]) {
            this.scene.remove(this.buildingMeshes[x][y]!)
          }
          if (newBuildingId) {
            this.buildingMeshes[x][y] = createAssetInstance(newBuildingId, x, y)
            this.scene.add(this.buildingMeshes[x][y]!)
          }
        }
      }
    }
  }

  setupLights() {
    const lights = [
      new THREE.AmbientLight(0xffffff, 0.2),
      new THREE.DirectionalLight(0xffffff, 0.3),
      new THREE.DirectionalLight(0xffffff, 0.3),
      new THREE.DirectionalLight(0xffffff, 0.3),
    ]
    lights[1].position.set(0, 1, 0)
    lights[2].position.set(1, 1, 0)
    lights[3].position.set(0, 1, 1)

    this.scene.add(...lights)
  }

  draw() {
    this.renderer.render(this.scene, this.camera)
  }
  start() {
    this.renderer.setAnimationLoop(this.draw.bind(this))
  }
  stop() {
    this.renderer.setAnimationLoop(null)
  }
}
