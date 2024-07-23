export function createCity(size: number) {
  const data: Tile[][] = []

  initialize()

  function initialize() {
    for (let x = 0; x < size; x++) {
      const column: Tile[] = []

      for (let y = 0; y < size; y++) {
        column.push({
          x,
          y,
          building: Math.random() > 0.7 ? 'building' : undefined,
        })
      }

      data.push(column)
    }
  }

  return {
    size,
    data,
  }
}

type Tile = {
  x: number
  y: number
  building?: string
}
