import type { AssetId } from './assets'

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
  terrainId: AssetId = 'grass'
  buildingId?: AssetId

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }

  update() {}
}
