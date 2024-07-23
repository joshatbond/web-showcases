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
        column.push({
          x,
          y,
          building: Math.random() > 0.7 ? 'building' : undefined,
          update: () => {},
        })
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

type Tile = {
  x: number
  y: number
  building?: string
  update: () => void
}
