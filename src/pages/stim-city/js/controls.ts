export class Controls {
  LEFT_MOUSE_BUTTON = 0
  MIDDLE_MOUSE_BUTTON = 1
  RIGHT_MOUSE_BUTTON = 2

  leftMouseDown = false
  middleMouseDown = false
  rightMouseDown = false
  shiftKeyDown = false
  subscribers: ((event: MouseEvent) => void)[]

  constructor() {
    this.subscribers = []

    window.addEventListener('keydown', this.#onKeyDown.bind(this))
    window.addEventListener('keyup', this.#onKeyUp.bind(this))
    window.addEventListener('mousedown', this.#onMouseDown.bind(this))
    window.addEventListener('mousemove', this.#onMouseMove.bind(this))
    window.addEventListener('mouseup', this.#onMouseUp.bind(this))

    // prevent right click context menu
    window.addEventListener('contextmenu', event => event.preventDefault())
  }

  get isPanning() {
    return this.leftMouseDown && this.shiftKeyDown
  }
  get isRotating() {
    return this.leftMouseDown && !this.shiftKeyDown
  }
  get isZooming() {
    return this.rightMouseDown
  }

  subscribe(callback: (event: MouseEvent) => void) {
    this.subscribers.push(callback)
  }

  #onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Shift') {
      this.shiftKeyDown = true
    }
  }
  #onKeyUp() {
    this.shiftKeyDown = false
  }

  #onMouseDown(event: MouseEvent) {
    switch (event.button) {
      case this.LEFT_MOUSE_BUTTON:
        this.leftMouseDown = true
        break
      case this.MIDDLE_MOUSE_BUTTON:
        this.middleMouseDown = true
        break
      case this.RIGHT_MOUSE_BUTTON:
        this.rightMouseDown = true
        break
      default:
        break
    }
  }

  #onMouseMove(event: MouseEvent) {
    for (const callback of this.subscribers) {
      callback(event)
    }
  }

  #onMouseUp(event: MouseEvent) {
    switch (event.button) {
      case this.LEFT_MOUSE_BUTTON:
        this.leftMouseDown = false
        break
      case this.MIDDLE_MOUSE_BUTTON:
        this.middleMouseDown = false
        break
      case this.RIGHT_MOUSE_BUTTON:
        this.rightMouseDown = false
        break
      default:
        break
    }
  }
}
