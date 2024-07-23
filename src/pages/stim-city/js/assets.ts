import { BoxGeometry, Mesh, MeshLambertMaterial } from 'three'

const geometry = new BoxGeometry(1, 1, 1)

const assets = {
  grass: (x: number, y: number) => {
    const material = new MeshLambertMaterial({ color: 0x00aa00 })
    const mesh = new Mesh(geometry, material)
    mesh.position.set(x, -0.5, y)

    return mesh
  },
  'building-1': (x: number, y: number) => {
    const material = new MeshLambertMaterial({ color: 0x777777 })
    const mesh = new Mesh(geometry, material)
    mesh.position.set(x, 0.5, y)

    return mesh
  },
  'building-2': (x: number, y: number) => {
    const material = new MeshLambertMaterial({ color: 0x777777 })
    const mesh = new Mesh(geometry, material)
    mesh.scale.set(1, 2, 1)
    mesh.position.set(x, 1, y)

    return mesh
  },
  'building-3': (x: number, y: number) => {
    const material = new MeshLambertMaterial({ color: 0x777777 })
    const mesh = new Mesh(geometry, material)
    mesh.position.set(x, 1.5, y)

    return mesh
  },
}

export function createAssetInstance(
  assetId: keyof typeof assets,
  x: number,
  y: number
) {
  if (!(assetId in assets)) {
    console.warn(`asset ${assetId} not found`)
    return null
  }

  return assets[assetId](x, y)
}
