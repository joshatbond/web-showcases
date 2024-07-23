import * as THREE from 'three'

import { createCamera } from './camera'
import type { City } from './city'
import { Controls } from './controls'

export class Scene {
  scene: THREE.Scene
  controls: Controls
  camera: THREE.PerspectiveCamera
  renderer: THREE.WebGLRenderer

  meshes: THREE.Mesh[][] = []

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

  initialize(city: City['data']) {
    this.scene.clear()
    this.meshes = []

    for (let x = 0; x < city.length; x++) {
      const column: THREE.Mesh[] = []

      for (let y = 0; y < city.length; y++) {
        // terrain
        const geometry = new THREE.BoxGeometry(1, 1, 1)
        const material = new THREE.MeshLambertMaterial({ color: 0x00aa00 })
        const mesh = new THREE.Mesh(geometry, material)
        mesh.position.set(x, -0.5, y)

        this.scene.add(mesh)

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

          this.scene.add(buildingMesh)
        }

        column.push(mesh)
      }

      this.meshes.push(column)
    }

    this.setupLights()
  }
  update(city: City['data']) {}

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
