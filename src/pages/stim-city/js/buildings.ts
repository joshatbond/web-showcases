import type { BuildingId } from './assets'

const buildings: Record<
  BuildingId,
  () => {
    dirty?: boolean
    height: number
    type:
      | `${Exclude<BuildingId, 'road'>}${1 | 2 | 3}`
      | Extract<BuildingId, 'road'>
    update: () => void
  }
> = {
  residential: () => {
    const typeIndex = Math.floor(3 * Math.random())
    return {
      height: 1,
      type:
        typeIndex === 0
          ? 'residential1'
          : typeIndex === 1
            ? 'residential2'
            : 'residential3',
      update: function () {
        if (this.height < 5) {
          if (Math.random() < 0.01) {
            this.dirty = true
            this.height += 1
          }
        }
      },
    }
  },
  commercial: () => {
    const typeIndex = Math.floor(3 * Math.random())
    return {
      height: 1,
      type:
        typeIndex === 0
          ? 'commercial1'
          : typeIndex === 1
            ? 'commercial2'
            : 'commercial3',
      update: function () {
        if (this.height < 5) {
          if (Math.random() < 0.01) {
            this.dirty = true
            this.height += 1
          }
        }
      },
    }
  },
  industrial: () => {
    const typeIndex = Math.floor(3 * Math.random())
    return {
      height: 1,
      type:
        typeIndex === 0
          ? 'industrial1'
          : typeIndex === 1
            ? 'industrial2'
            : 'industrial3',
      update: function () {
        if (this.height < 5) {
          if (Math.random() < 0.01) {
            this.dirty = true
            this.height += 1
          }
        }
      },
    }
  },
  road: () => {
    return {
      type: 'road',
      height: 0.01,
      // dirty: true,
      update: function () {
        this.dirty = false
      },
    }
  },
} as const

export default buildings
