export class City {
  size: number
  data: Tile[][]

  constructor(size: number) {
    this.data = []
    this.size = size

    this.initialize()
  }

  initialize() {
    for (let x = 0; x < this.size; x++) {
      const column: Tile[] = []

      for (let y = 0; y < this.size; y++) {
        column.push(new Tile(x, y))
      }

      this.data.push(column)
    }
  }

  update() {
    for (let x = 0; x < this.size; x++) {
      for (let y = 0; y < this.size; y++) {
        this.data[x][y].update()
      }
    }
  }
}

class Tile {
  x: number
  y: number
  building?: string

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }

  update() {
    const x = Math.random()
    if (x < 0.01) {
      switch (this.building) {
        case undefined:
          this.building = 'building-1'
          break
        case 'building-1':
          this.building = 'building-2'
          break
        case 'building-2':
          this.building = 'building-3'
          break
        default:
          break
      }
    }
  }
}
