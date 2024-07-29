import { PerspectiveCamera, Vector3 } from 'three'

import type { Controls } from './controls'

const MIN_CAMERA_RADIUS = 10
const MAX_CAMERA_RADIUS = 20
const MIN_CAMERA_ELEVATION = 30
const MAX_CAMERA_ELEVATION = 90
const ZOOM_SENSITIVITY = 1
const PAN_SENSITIVITY = -0.01
const ROTATION_SENSITIVITY = 0.5

const Y_AXIS = new Vector3(0, 1, 0)
const DEG_TO_RAD = Math.PI / 180

export class Camera {
  camera: PerspectiveCamera
  controls: Controls
  origin: Vector3
  radius: number
  azimuth: number
  elevation: number
  previousMouseX: number
  previousMouseY: number

  constructor(aspectRatio: number, controls: Controls) {
    this.camera = new PerspectiveCamera(75, aspectRatio, 0.1, 1000)
    this.controls = controls
    this.origin = new Vector3(0, 0, 0)
    this.radius = (MIN_CAMERA_RADIUS + MAX_CAMERA_RADIUS) / 2
    this.azimuth = 0
    this.elevation = 45
    this.previousMouseX = 0
    this.previousMouseY = 0

    this.controls.subscribe('onMouseMove', this.onMouseMove.bind(this))
    this.controls.subscribe('onWheel', this.onWheel.bind(this))
    this.controls.subscribe('onKeyDown', this.onKeyDown.bind(this))
  }
  get isPanningMouse() {
    return this.controls.rightMouseDown && this.controls.shiftKeyDown
  }
  get isPanningKeys() {
    return (
      this.controls.directions.up ||
      this.controls.directions.down ||
      this.controls.directions.left ||
      this.controls.directions.right
    )
  }
  get isRotatingMouse() {
    return this.controls.rightMouseDown && !this.controls.shiftKeyDown
  }
  get isRotatingKeys() {
    return this.controls.directions.cw || this.controls.directions.ccw
  }
  get isZooming() {
    return this.controls.wheelMove
  }

  updateOrigin(center: number) {
    this.origin.set(center - 2, 0, center)
    this.updateCameraPosition()
  }
  onMouseMove(event: MouseEvent) {
    const dx = event.clientX - this.previousMouseX
    const dy = event.clientY - this.previousMouseY

    // camera rotation
    if (this.isRotatingMouse) {
      this.azimuth -= dx * ROTATION_SENSITIVITY
      this.elevation += dy * ROTATION_SENSITIVITY
      this.elevation = clamp(
        this.elevation,
        MIN_CAMERA_ELEVATION,
        MAX_CAMERA_ELEVATION
      )
      this.updateCameraPosition()
    }

    // camera pan
    if (this.isPanningMouse) {
      const forward = new Vector3(0, 0, 1).applyAxisAngle(
        Y_AXIS,
        this.azimuth * DEG_TO_RAD
      )
      const left = new Vector3(1, 0, 0).applyAxisAngle(
        Y_AXIS,
        this.azimuth * DEG_TO_RAD
      )

      this.origin.add(forward.multiplyScalar(PAN_SENSITIVITY * dy))
      this.origin.add(left.multiplyScalar(PAN_SENSITIVITY * dx))
      this.updateCameraPosition()
    }

    this.previousMouseX = event.clientX
    this.previousMouseY = event.clientY
  }
  onWheel(event: WheelEvent) {
    const direction = event.deltaY > 0 ? 1 : -1
    this.radius += direction * ZOOM_SENSITIVITY
    this.radius = clamp(this.radius, MIN_CAMERA_RADIUS, MAX_CAMERA_RADIUS)
    this.updateCameraPosition()
  }

  onKeyDown(event: KeyboardEvent) {
    const now = Date.now()
    if (this.isRotatingKeys) {
      const dx = this.controls.directions.cw ? 1 : -1
      this.azimuth -= dx * ROTATION_SENSITIVITY
      this.updateCameraPosition()
    }

    // camera pan
    if (this.isPanningKeys) {
      const dx = this.controls.directions.left
        ? (now - this.controls.directions.left) / 1e2
        : this.controls.directions.right
          ? (this.controls.directions.right - now) / 1e2
          : 0
      const dy = this.controls.directions.up
        ? (this.controls.directions.up - now) / 1e2
        : this.controls.directions.down
          ? (now - this.controls.directions.down) / 1e2
          : 0
      const forward = new Vector3(0, 0, 1).applyAxisAngle(
        Y_AXIS,
        this.azimuth * DEG_TO_RAD
      )
      const left = new Vector3(1, 0, 0).applyAxisAngle(
        Y_AXIS,
        this.azimuth * DEG_TO_RAD
      )

      this.origin.add(forward.multiplyScalar(PAN_SENSITIVITY * dy))
      this.origin.add(left.multiplyScalar(PAN_SENSITIVITY * dx))
      this.updateCameraPosition()
    }
  }

  /**
   * @description Convert cartesian to spherical coordinates and update camera position
   */
  updateCameraPosition() {
    this.camera.position.x =
      this.radius *
      Math.sin(this.azimuth * DEG_TO_RAD) *
      Math.cos(this.elevation * DEG_TO_RAD)
    this.camera.position.y = this.radius * Math.sin(this.elevation * DEG_TO_RAD)
    this.camera.position.z =
      this.radius *
      Math.cos(this.azimuth * DEG_TO_RAD) *
      Math.cos(this.elevation * DEG_TO_RAD)

    this.camera.position.add(this.origin)
    this.camera.lookAt(this.origin)
    this.camera.updateMatrix()
  }
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}
