import { PerspectiveCamera, Vector3 } from 'three'

const LEFT_MOUSE_BUTTON = 0
const MIDDLE_MOUSE_BUTTON = 1
const RIGHT_MOUSE_BUTTON = 2

const MIN_CAMERA_RADIUS = 2
const MAX_CAMERA_RADIUS = 10
const MIN_CAMERA_ELEVATION = 30
const MAX_CAMERA_ELEVATION = 90
const ZOOM_SENSITIVITY = 0.02
const PAN_SENSITIVITY = -0.01
const ROTATION_SENSITIVITY = 0.5

const Y_AXIS = new Vector3(0, 1, 0)
const DEG_TO_RAD = Math.PI / 180

export function createCamera(aspectRatio: number) {
  const camera = new PerspectiveCamera(75, aspectRatio, 0.1, 1000)
  let cameraOrigin = new Vector3(0, 0, 0)
  let cameraRadius = 4
  let cameraAzimuth = 0
  let cameraElevation = 0
  let isLeftMouseDown = false
  let isMiddleMouseDown = false
  let isRightMouseDown = false
  let prevMouseX = 0
  let prevMouseY = 0
  updateCameraPosition()

  function onMouseDown(event: MouseEvent) {
    switch (event.button) {
      case LEFT_MOUSE_BUTTON:
        isLeftMouseDown = true
        break
      case MIDDLE_MOUSE_BUTTON:
        isMiddleMouseDown = true
        break
      case RIGHT_MOUSE_BUTTON:
        isRightMouseDown = true
        break
      default:
        break
    }
  }
  function onMouseMove(event: MouseEvent) {
    const dx = event.clientX - prevMouseX
    const dy = event.clientY - prevMouseY

    // camera rotation
    if (isLeftMouseDown) {
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
    if (isMiddleMouseDown) {
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
    if (isRightMouseDown) {
      cameraRadius += dy * ZOOM_SENSITIVITY
      cameraRadius = clamp(cameraRadius, MIN_CAMERA_RADIUS, MAX_CAMERA_RADIUS)
      updateCameraPosition()
    }

    prevMouseX = event.clientX
    prevMouseY = event.clientY
  }
  function onMouseUp(event: MouseEvent) {
    switch (event.button) {
      case LEFT_MOUSE_BUTTON:
        isLeftMouseDown = false
        break
      case MIDDLE_MOUSE_BUTTON:
        isMiddleMouseDown = false
        break
      case RIGHT_MOUSE_BUTTON:
        isRightMouseDown = false
        break
      default:
        break
    }
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

  return { camera, onMouseDown, onMouseMove, onMouseUp }
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}
