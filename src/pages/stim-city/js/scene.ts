import * as THREE from 'three'

import { createAssetInstance } from './assets'
import { Camera } from './camera'
import type { City } from './city'
import { Controls } from './controls'

export class Scene {
  /** A reference to thethree.js scene */
  scene: THREE.Scene
  /** A reference to the controls object */
  controls: Controls
  /** A reference to the camera manager */
  camera: Camera
  /** A reference to the three.js renderer */
  renderer: THREE.WebGLRenderer
  /** A reference to the raycaster */
  raycaster: THREE.Raycaster

  /** A reference to the mouse position */
  mouse: THREE.Vector2
  /** The currently selected object */
  selectedObject: THREE.Object3D | null
  /** The callback to be called when an object is selected */
  onObjectSelected: ((object: THREE.Object3D) => void) | undefined

  /** A 2d array of building meshes at each tile location */
  terrainMeshes: THREE.Mesh[][] = []
  /** A 2d array of building meshes at each tile location */
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
    this.renderer.setClearColor(0x000000, 0)
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
    gameWindow.appendChild(this.renderer.domElement)

    this.scene.add(this.camera.camera)
    this.controls.subscribe('onMouseDown', this.onMouseDown.bind(this))
  }

  initialize(city: City) {
    this.scene.clear()
    this.terrainMeshes = []
    this.buildingMeshes = []

    for (let x = 0; x < city.data.length; x++) {
      const column: THREE.Mesh[] = []

      for (let y = 0; y < city.data.length; y++) {
        // terrain
        const mesh = createAssetInstance(
          city.data[x][y].terrainId,
          x,
          y,
          undefined
        )

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
          const typeId =
            tile.building.type === 'road'
              ? 'road'
              : tile.building.type.includes('residential')
                ? 'residential'
                : tile.building.type.includes('commercial')
                  ? 'commercial'
                  : 'industrial'

          this.buildingMeshes[x][y] = createAssetInstance(
            typeId,
            x,
            y,
            tile.building.type === 'road' ? undefined : tile.building
          )
          this.scene.add(this.buildingMeshes[x][y]!)
          tile.building.dirty = false
        }
      }
    }
  }

  setupLights() {
    const sun = new THREE.DirectionalLight(0xffffff, 1)
    sun.position.set(20, 20, 20)
    sun.castShadow = true
    sun.shadow.camera.left = -10
    sun.shadow.camera.right = 10
    sun.shadow.camera.top = 0
    sun.shadow.camera.bottom = -10
    sun.shadow.camera.near = 0.5
    sun.shadow.camera.far = 50
    sun.shadow.mapSize.width = 1024
    sun.shadow.mapSize.height = 1024

    this.scene.add(...[sun, new THREE.AmbientLight(0xffffff, 0.3)])
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
        this.selectedObject.material.emissive?.setHex(0x000000)
      }

      this.selectedObject = intersections[0].object
      if (this.selectedObject instanceof THREE.Mesh) {
        this.selectedObject.material.emissive?.setHex(0x555555)
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
