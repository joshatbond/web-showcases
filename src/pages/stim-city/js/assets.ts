import { BoxGeometry, Mesh, MeshLambertMaterial } from 'three'

const geometry = new BoxGeometry(1, 1, 1)

const assets = {
  grass: (x: number, y: number, data: Data) => {
    const material = new MeshLambertMaterial({ color: 0x00aa00 })
    const mesh = new Mesh(geometry, material)
    mesh.userData = { id: 'grass', x, y }
    mesh.position.set(x, -0.5, y)

    return mesh
  },
  residential: (x: number, y: number, data: Data) => {
    console.log('residential', x, y, data)
    const material = new MeshLambertMaterial({ color: 0x00ff00 })
    const mesh = new Mesh(geometry, material)
    mesh.userData = { id: 'residential', x, y }
    mesh.scale.set(1, data.height, 1)
    mesh.position.set(x, data.height / 2, y)

    return mesh
  },
  commercial: (x: number, y: number, data: Data) => {
    const material = new MeshLambertMaterial({ color: 0x0000ff })
    const mesh = new Mesh(geometry, material)
    mesh.userData = { id: 'commercial', x, y }
    mesh.scale.set(1, data.height, 1)
    mesh.position.set(x, data.height / 2, y)

    return mesh
  },
  industrial: (x: number, y: number, data: Data) => {
    const material = new MeshLambertMaterial({ color: 0xffff00 })
    const mesh = new Mesh(geometry, material)
    mesh.userData = { id: 'industrial', x, y }
    mesh.scale.set(1, data.height, 1)
    mesh.position.set(x, data.height / 2, y)

    return mesh
  },
  road: (x: number, y: number, data: Data) => {
    const material = new MeshLambertMaterial({ color: 0x4444440 })
    const mesh = new Mesh(geometry, material)
    mesh.userData = { id: 'road', x, y }
    mesh.scale.set(1, data.height, 1)
    mesh.position.set(x, data.height / 2, y)

    return mesh
  },
}
const assetIds = Object.keys(assets) as AssetId[]

export function createAssetInstance(
  assetId: AssetId,
  x: number,
  y: number,
  data: Data
) {
  if (!(assetId in assets)) {
    console.warn(`asset ${assetId} not found`)
    return null
  }

  return assets[assetId](x, y, data)
}

type Data = { height: number }
export type AssetId = keyof typeof assets
export type TerrainId = Extract<AssetId, 'grass'>
export type BuildingId = Exclude<AssetId, 'grass'>
export function isBuildingId(id: string): id is BuildingId {
  return assetIds.includes(id as BuildingId)
}
