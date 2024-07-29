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
    window.addEventListener('contextmenu', event => {
      if (
        event.target instanceof HTMLElement &&
        event.target.tagName.toLowerCase() === 'canvas'
      ) {
        event.preventDefault()
      }
    })
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
    switch (event.key.toLowerCase()) {
      case 'shift':
        this.shiftKeyDown = true
        break
      case 'arrowup':
      case 'w':
        if (!this.directions.up) {
          this.directions.up = Date.now()
        }
        break
      case 'arrowdown':
      case 's':
        if (!this.directions.down) {
          this.directions.down = Date.now()
        }
        break
      case 'arrowleft':
      case 'a':
        if (!this.directions.left) {
          this.directions.left = Date.now()
        }
        break
      case 'arrowright':
      case 'd':
        if (!this.directions.right) {
          this.directions.right = Date.now()
        }
        break
      case 'q':
        this.directions.cw = true
        break
      case 'e':
        this.directions.ccw = true
        break
    }

    for (const callback of this.subscribers.onKeyDown) {
      callback(event)
    }
  }
  #onKeyUp(event: KeyboardEvent) {
    switch (event.key.toLowerCase()) {
      case 'shift':
        this.shiftKeyDown = false
        break
      case 'arrowup':
      case 'w':
        this.directions.up = 0
        break
      case 'arrowdown':
      case 's':
        this.directions.down = 0
        break
      case 'arrowleft':
      case 'a':
        this.directions.left = 0
        break
      case 'arrowright':
      case 'd':
        this.directions.right = 0
        break
      case 'q':
        this.directions.cw = false
        break
      case 'e':
        this.directions.ccw = false
        break
    }

    for (const callback of this.subscribers.onKeyUp) {
      callback(event)
    }
  }

  #onMouseDown(event: MouseEvent) {
    if (
      event.target instanceof HTMLElement &&
      event.target.tagName.toLowerCase() !== 'canvas'
    ) {
      return
    }
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
