import { PerspectiveCamera, Vector3 } from 'three'

import type { Controls } from './controls'

const MIN_CAMERA_RADIUS = 10
const MAX_CAMERA_RADIUS = 20
const MIN_CAMERA_ELEVATION = 30
const MAX_CAMERA_ELEVATION = 90
const ZOOM_SENSITIVITY = 0.02
const PAN_SENSITIVITY = -0.01
const ROTATION_SENSITIVITY = 0.5

const Y_AXIS = new Vector3(0, 1, 0)
const DEG_TO_RAD = Math.PI / 180

export function createCamera(aspectRatio: number, controls: Controls) {
  controls.subscribe(onMouseMove)

  const camera = new PerspectiveCamera(75, aspectRatio, 0.1, 1000)
  let cameraOrigin = new Vector3(0, 0, 0)
  let cameraRadius = (MIN_CAMERA_RADIUS + MAX_CAMERA_RADIUS) / 2
  let cameraAzimuth = 135
  let cameraElevation = 45
  let prevMouseX = 0
  let prevMouseY = 0
  updateCameraPosition()

  function onMouseMove(event: MouseEvent) {
    const dx = event.clientX - prevMouseX
    const dy = event.clientY - prevMouseY

    // camera rotation
    if (controls.isRotating) {
      cameraAzimuth -= dx * ROTATION_SENSITIVITY
      cameraElevation += dy * ROTATION_SENSITIVITY
      cameraElevation = clamp(
        cameraElevation,
        MIN_CAMERA_ELEVATION,
        MAX_CAMERA_ELEVATION
      )
      updateCameraPosition()
    }

    // camera pan
    if (controls.isPanning) {
      const forward = new Vector3(0, 0, 1).applyAxisAngle(
        Y_AXIS,
        cameraAzimuth * DEG_TO_RAD
      )
      const left = new Vector3(1, 0, 0).applyAxisAngle(
        Y_AXIS,
        cameraAzimuth * DEG_TO_RAD
      )

      cameraOrigin.add(forward.multiplyScalar(PAN_SENSITIVITY * dy))
      cameraOrigin.add(left.multiplyScalar(PAN_SENSITIVITY * dx))
      updateCameraPosition()
    }

    // camera zoom
    if (controls.isZooming) {
      cameraRadius += dy * ZOOM_SENSITIVITY
      cameraRadius = clamp(cameraRadius, MIN_CAMERA_RADIUS, MAX_CAMERA_RADIUS)
      updateCameraPosition()
    }

    prevMouseX = event.clientX
    prevMouseY = event.clientY
  }
  /**
   * @description Convert cartesian to spherical coordinates and update camera position
   */
  function updateCameraPosition() {
    camera.position.x =
      cameraRadius *
      Math.sin(cameraAzimuth * DEG_TO_RAD) *
      Math.cos(cameraElevation * DEG_TO_RAD)
    camera.position.y = cameraRadius * Math.sin(cameraElevation * DEG_TO_RAD)
    camera.position.z =
      cameraRadius *
      Math.cos(cameraAzimuth * DEG_TO_RAD) *
      Math.cos(cameraElevation * DEG_TO_RAD)

    camera.position.add(cameraOrigin)
    camera.lookAt(cameraOrigin)
    camera.updateMatrix()
  }

  return camera
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}
