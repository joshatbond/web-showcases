import type { BuildingId } from './assets'

export default {
  residential: () => {
    return {
      id: 'residential',
      update: () => {},
    }
  },
  commercial: () => {
    return {
      id: 'commercial',
      update: () => {},
    }
  },
  industrial: () => {
    return {
      id: 'industrial',
      update: () => {},
    }
  },
  road: () => {
    return {
      id: 'road',
      update: () => {},
    }
  },
} satisfies Record<BuildingId, () => { id: BuildingId; update: () => void }>
