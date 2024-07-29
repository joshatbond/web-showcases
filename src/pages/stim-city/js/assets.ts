import {
  BoxGeometry,
  Mesh,
  MeshLambertMaterial,
  RepeatWrapping,
  TextureLoader,
} from 'three'

/**
 *
 * @param type The type of asset to create
 * @param x The x-coordinate of the asset
 * @param y The y-coordinate of the asset
 * @param data Additional metadata needed for creating the asset
 */
export function createAssetInstance<T extends AssetId>(
  type: T,
  x: number,
  y: number,
  data: T extends 'ground' | 'road' ? undefined : Data
) {
  if (!(type in assets)) {
    console.warn(`asset ${type} not found`)
    return null
  }

  if (type === 'ground') {
    return assets.ground(x, y)
  }

  return assets[type](x, y, data!)
}
export function isBuildingId(id: string): id is BuildingId {
  return assetIds.includes(id as BuildingId)
}

export type AssetId = keyof typeof assets
export type TerrainId = Extract<AssetId, 'ground'>
export type BuildingId = Exclude<AssetId, 'ground'>

const cube = new BoxGeometry(1, 1, 1)
const loader = new TextureLoader()

const textures = {
  commercial1: loadTexture('/assets/stim-city/textures/commercial1.png'),
  commercial2: loadTexture('/assets/stim-city/textures/commercial2.png'),
  commercial3: loadTexture('/assets/stim-city/textures/commercial3.png'),
  grass: loadTexture('/assets/stim-city/textures/grass.png'),
  industrial1: loadTexture('/assets/stim-city/textures/industrial1.png'),
  industrial2: loadTexture('/assets/stim-city/textures/industrial2.png'),
  industrial3: loadTexture('/assets/stim-city/textures/industrial3.png'),
  residential1: loadTexture('/assets/stim-city/textures/residential1.png'),
  residential2: loadTexture('/assets/stim-city/textures/residential2.png'),
  residential3: loadTexture('/assets/stim-city/textures/residential3.png'),
}

const assets = {
  ground: (x: number, y: number) => {
    const material = new MeshLambertMaterial({ map: textures.grass })
    const mesh = new Mesh(cube, material)
    mesh.userData = { x, y }
    mesh.position.set(x, -0.5, y)
    mesh.receiveShadow = true

    return mesh
  },
  residential: createZoneMesh,
  commercial: createZoneMesh,
  industrial: createZoneMesh,
  road: (x: number, y: number) => {
    const material = new MeshLambertMaterial({ color: 0x222222 })
    const mesh = new Mesh(cube, material)
    mesh.userData = { x, y }
    mesh.scale.set(1, 0.02, 1)
    mesh.position.set(x, 0.01, y)
    mesh.receiveShadow = true

    return mesh
  },
}
const assetIds = Object.keys(assets) as AssetId[]

function loadTexture(path: string) {
  const texture = loader.load(path)
  texture.wrapS = texture.wrapT = RepeatWrapping
  texture.repeat.set(1, 1)
  return texture
}
function getTopMaterial() {
  return new MeshLambertMaterial({ color: 0x555555 })
}
function getSideMaterial(type: Exclude<keyof typeof textures, 'grass'>) {
  return new MeshLambertMaterial({ map: textures[type].clone() })
}
function createZoneMesh(x: number, y: number, data: Data) {
  if (data.type === 'road') {
    throw new Error('roads should not be created with createZoneMesh')
  }
  const topMaterial = getTopMaterial()
  const sideMaterial = getSideMaterial(data.type)
  const mesh = new Mesh(cube, [
    sideMaterial, // +X
    sideMaterial, // -X
    topMaterial, //  +Y
    topMaterial, //  -Y
    sideMaterial, // +Z
    sideMaterial, // -Z
  ])
  mesh.userData = { x, y }
  mesh.scale.set(0.8, (data.height - 0.95) / 2, 0.8)
  mesh.material.forEach(material =>
    material.map?.repeat.set(1, data.height - 1)
  )
  mesh.position.set(x, (data.height - 0.95) / 4, y)
  mesh.receiveShadow = true
  mesh.castShadow = true

  return mesh
}

type Data = {
  height: number
  type: Exclude<keyof typeof textures, 'grass'> | 'road'
  style?: number
}
