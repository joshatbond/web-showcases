export class Controls {
  LEFT_MOUSE_BUTTON = 0
  MIDDLE_MOUSE_BUTTON = 1
  RIGHT_MOUSE_BUTTON = 2

  leftMouseDown = false
  middleMouseDown = false
  wheelMove = false
  wheelDirection = 0
  rightMouseDown = false
  shiftKeyDown = false
  directions = {
    up: 0,
    down: 0,
    left: 0,
    right: 0,
    cw: false,
    ccw: false,
  }
  subscribers = {
    onKeyDown: [] as ((event: KeyboardEvent) => void)[],
    onKeyUp: [] as ((event: KeyboardEvent) => void)[],
    onMouseDown: [] as ((event: MouseEvent) => void)[],
    onMouseMove: [] as ((event: MouseEvent) => void)[],
    onMouseUp: [] as ((event: MouseEvent) => void)[],
    onWheel: [] as ((event: WheelEvent) => void)[],
  } as const

  constructor() {
    window.addEventListener('keydown', this.#onKeyDown.bind(this))
    window.addEventListener('keyup', this.#onKeyUp.bind(this))
    window.addEventListener('mousedown', this.#onMouseDown.bind(this))
    window.addEventListener('mousemove', this.#onMouseMove.bind(this))
    window.addEventListener('mouseup', this.#onMouseUp.bind(this))
    window.addEventListener('wheel', this.#onWheel.bind(this))

    // prevent right click context menu
    window.addEventListener('contextmenu', event => event.preventDefault())
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
      case 'onWheel':
        this.subscribers.onWheel.push(callback as (event: WheelEvent) => void)
        break
      default:
        break
    }
  }

  #onKeyDown(event: KeyboardEvent) {
    this.shiftKeyDown = event.key === 'Shift'
    if (
      (event.key === 'ArrowUp' || event.key.toLowerCase() === 'w') &&
      !this.directions.up
    ) {
      this.directions.up = Date.now()
    }
    if (
      (event.key === 'ArrowDown' || event.key.toLowerCase() === 's') &&
      !this.directions.down
    ) {
      this.directions.down = Date.now()
    }
    if (
      (event.key === 'ArrowLeft' || event.key.toLowerCase() === 'a') &&
      !this.directions.left
    ) {
      this.directions.left = Date.now()
    }
    if (
      (event.key === 'ArrowRight' || event.key.toLowerCase() === 'd') &&
      !this.directions.right
    ) {
      this.directions.right = Date.now()
    }
    this.directions.cw = event.key.toLowerCase() === 'q'
    this.directions.ccw = event.key.toLowerCase() === 'e'

    for (const callback of this.subscribers.onKeyDown) {
      callback(event)
    }
  }
  #onKeyUp(event: KeyboardEvent) {
    this.shiftKeyDown = false
    if (event.key === 'ArrowUp' || event.key.toLowerCase() === 'w') {
      this.directions.up = 0
    }
    if (event.key === 'ArrowDown' || event.key.toLowerCase() === 's') {
      this.directions.down = 0
    }

    if (event.key === 'ArrowLeft' || event.key.toLowerCase() === 'a') {
      this.directions.left = 0
    }
    if (event.key === 'ArrowRight' || event.key.toLowerCase() === 'd') {
      this.directions.right = 0
    }
    this.directions.cw = event.key.toLowerCase() === 'q'
    this.directions.ccw = event.key.toLowerCase() === 'e'

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

  #onWheel(event: WheelEvent) {
    for (const callback of this.subscribers.onWheel) {
      callback(event)
    }
  }
}

type Event = keyof typeof Controls.prototype.subscribers
type Callback = (typeof Controls.prototype.subscribers)[Event][number]
