import * as THREE from 'three'

import { createAssetInstance } from './assets'
import { Camera } from './camera'
import type { City } from './city'
import { Controls } from './controls'

export class Scene {
  scene: THREE.Scene
  controls: Controls
  camera: Camera
  renderer: THREE.WebGLRenderer
  raycaster: THREE.Raycaster
  mouse: THREE.Vector2
  selectedObject: THREE.Object3D | null
  onObjectSelected: ((object: THREE.Object3D) => void) | undefined

  terrainMeshes: THREE.Mesh[][] = []
  buildingMeshes: (THREE.Mesh | null)[][] = []

  constructor() {
    const gameWindow = document.querySelector(
      '.render-target'
    ) as HTMLDivElement | null
    if (!gameWindow) throw new Error('game window missing')

    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(0x777777)
    this.raycaster = new THREE.Raycaster()
    this.mouse = new THREE.Vector2()
    this.selectedObject = null

    this.controls = new Controls()
    this.camera = new Camera(
      gameWindow.offsetWidth / gameWindow.offsetHeight,
      this.controls
    )

    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.renderer.setSize(gameWindow.offsetWidth, gameWindow.offsetHeight)
    gameWindow.appendChild(this.renderer.domElement)

    this.scene.add(this.camera.camera)
    this.controls.subscribe('onMouseDown', this.onMouseDown.bind(this))
  }

  initialize(city: City) {
    this.scene.clear()
    this.terrainMeshes = []

    for (let x = 0; x < city.data.length; x++) {
      const column: THREE.Mesh[] = []

      for (let y = 0; y < city.data.length; y++) {
        // terrain
        const mesh = createAssetInstance(city.data[x][y].terrainId, x, y, {
          height: 0,
        })

        if (mesh) {
          this.scene.add(mesh)
          column.push(mesh)
        }
      }

      this.terrainMeshes.push(column)
      this.buildingMeshes.push([...Array(city.size)])
    }
    const center = Math.floor(city.size / 2)
    this.camera.updateOrigin(center)

    this.setupLights()
  }
  update(city: City['data']) {
    for (let x = 0; x < city.length; x++) {
      for (let y = 0; y < city.length; y++) {
        const existingBuildingMesh = this.buildingMeshes[x][y]
        const tile = city[x][y]

        // If the player removes a building, remove it from the scene
        if (!tile.building && existingBuildingMesh) {
          this.scene.remove(existingBuildingMesh)
          this.buildingMeshes[x][y] = null
        }

        // if the data model has changed, update the mesh
        if (
          tile.building &&
          (tile.building.dirty || tile.building.dirty === undefined)
        ) {
          if (existingBuildingMesh) {
            this.scene.remove(existingBuildingMesh)
          }
          this.buildingMeshes[x][y] = createAssetInstance(
            tile.building.id,
            x,
            y,
            tile.building
          )
          this.scene.add(this.buildingMeshes[x][y]!)
          tile.building.dirty = false
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

  onMouseDown(event: MouseEvent) {
    this.mouse.x =
      (event.clientX / this.renderer.domElement.clientWidth) * 2 - 1
    this.mouse.y =
      -(event.clientY / this.renderer.domElement.clientHeight) * 2 + 1
    this.raycaster.setFromCamera(this.mouse, this.camera.camera)

    let intersections = this.raycaster.intersectObjects(
      this.scene.children,
      false
    )
    if (intersections.length > 0) {
      if (this.selectedObject && this.selectedObject instanceof THREE.Mesh) {
        this.selectedObject.material.emissive.setHex(0x000000)
      }

      this.selectedObject = intersections[0].object
      if (this.selectedObject instanceof THREE.Mesh) {
        this.selectedObject.material.emissive.setHex(0x555555)
      }
      if (this.onObjectSelected) {
        this.onObjectSelected(this.selectedObject)
      }
    }
  }

  draw() {
    this.renderer.render(this.scene, this.camera.camera)
  }
  start() {
    this.renderer.setAnimationLoop(this.draw.bind(this))
  }
  stop() {
    this.renderer.setAnimationLoop(null)
  }
}
