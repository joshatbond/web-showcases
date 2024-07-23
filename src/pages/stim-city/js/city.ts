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
  terrainId = 'grass'
  buildingId?: 'building-1' | 'building-2' | 'building-3'

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }

  update() {
    const x = Math.random()
    if (x < 0.01) {
      switch (this.buildingId) {
        case undefined:
          this.buildingId = 'building-1'
          break
        case 'building-1':
          this.buildingId = 'building-2'
          break
        case 'building-2':
          this.buildingId = 'building-3'
          break
        default:
          break
      }
    }
  }
}
