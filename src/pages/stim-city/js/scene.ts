import * as THREE from 'three'

import { createCamera } from './camera'
import type { City } from './city'
import { Controls } from './controls'

export class Scene {
  scene: THREE.Scene
  controls: Controls
  camera: THREE.PerspectiveCamera
  renderer: THREE.WebGLRenderer

  terrainMeshes: THREE.Mesh[][] = []
  buildingMeshes: THREE.Mesh[][] = []

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
        const geometry = new THREE.BoxGeometry(1, 1, 1)
        const material = new THREE.MeshLambertMaterial({ color: 0x00aa00 })
        const mesh = new THREE.Mesh(geometry, material)
        mesh.position.set(x, -0.5, y)

        this.scene.add(mesh)
        column.push(mesh)
      }

      this.terrainMeshes.push(column)
      this.buildingMeshes.push([...Array(city.size)])
    }

    this.setupLights()
  }
  update(city: City['data']) {
    for (let x = 0; x < city.length; x++) {
      for (let y = 0; y < city.length; y++) {
        // buildings
        const tile = city[x][y]
        if (tile.building && tile.building.startsWith('building')) {
          const height = Number(tile.building.slice(-1))
          const buildingGeometry = new THREE.BoxGeometry(1, height, 1)
          const buildingMaterial = new THREE.MeshLambertMaterial({
            color: 0x777777,
          })
          const buildingMesh = new THREE.Mesh(
            buildingGeometry,
            buildingMaterial
          )
          buildingMesh.position.set(x, height / 2, y)

          if (this.buildingMeshes[x][y]) {
            this.scene.remove(this.buildingMeshes[x][y])
          }

          this.scene.add(buildingMesh)
          this.buildingMeshes[x][y] = buildingMesh
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
