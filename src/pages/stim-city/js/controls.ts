export class Controls {
  LEFT_MOUSE_BUTTON = 0
  MIDDLE_MOUSE_BUTTON = 1
  RIGHT_MOUSE_BUTTON = 2

  leftMouseDown = false
  middleMouseDown = false
  rightMouseDown = false
  shiftKeyDown = false
  subscribers = {
    onKeyDown: [] as ((event: KeyboardEvent) => void)[],
    onKeyUp: [] as ((event: KeyboardEvent) => void)[],
    onMouseDown: [] as ((event: MouseEvent) => void)[],
    onMouseMove: [] as ((event: MouseEvent) => void)[],
    onMouseUp: [] as ((event: MouseEvent) => void)[],
  } as const

  constructor() {
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

  subscribe<
    K extends keyof typeof Controls.prototype.subscribers,
    V extends (typeof Controls.prototype.subscribers)[K][number],
  >(event: K, callback: V) {
    switch (event) {
      case 'onKeyDown':
        this.subscribers.onKeyDown.push(
          callback as (event: KeyboardEvent) => void
        )
        break
      case 'onKeyUp':
        this.subscribers.onKeyUp.push(
          callback as (event: KeyboardEvent) => void
        )
        break
      case 'onMouseDown':
        this.subscribers.onMouseDown.push(
          callback as (event: MouseEvent) => void
        )
        break
      case 'onMouseMove':
        this.subscribers.onMouseMove.push(
          callback as (event: MouseEvent) => void
        )
        break
      case 'onMouseUp':
        this.subscribers.onMouseUp.push(callback as (event: MouseEvent) => void)
        break
      default:
        break
    }
  }

  #onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Shift') {
      this.shiftKeyDown = true
    }
    for (const callback of this.subscribers.onKeyDown) {
      callback(event)
    }
  }
  #onKeyUp(event: KeyboardEvent) {
    this.shiftKeyDown = false
    for (const callback of this.subscribers.onKeyUp) {
      callback(event)
    }
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
    for (const callback of this.subscribers.onMouseDown) {
      callback(event)
    }
  }

  #onMouseMove(event: MouseEvent) {
    for (const callback of this.subscribers.onMouseMove) {
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
    for (const callback of this.subscribers.onMouseUp) {
      callback(event)
    }
  }
}

type Event = keyof typeof Controls.prototype.subscribers
type Callback = (typeof Controls.prototype.subscribers)[Event][number]
