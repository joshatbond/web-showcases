import type { BuildingId } from './assets'

const buildings: Record<
  BuildingId,
  () => { id: BuildingId; height: number; update: () => void; dirty?: boolean }
> = {
  residential: () => {
    return {
      id: 'residential',
      height: 1,
      // dirty: true,
      update: function () {
        if (Math.random() < 0.01) {
          this.dirty = true
          if (this.height < 5) {
            this.height += 1
          }
        }
      },
    }
  },
  commercial: () => {
    return {
      id: 'commercial',
      height: 1,
      // dirty: true,
      update: function () {
        if (Math.random() < 0.01) {
          if (this.height < 5) {
            this.dirty = true
            this.height += 1
          }
        }
      },
    }
  },
  industrial: () => {
    return {
      id: 'industrial',
      height: 1,
      // dirty: true,
      update: function () {
        if (Math.random() < 0.01) {
          if (this.height < 5) {
            this.dirty = true
            this.height += 1
          }
        }
      },
    }
  },
  road: () => {
    return {
      id: 'road',
      height: 0.1,
      // dirty: true,
      update: function () {
        this.dirty = false
      },
    }
  },
} as const

export default buildings
