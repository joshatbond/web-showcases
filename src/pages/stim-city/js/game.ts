import { City } from './city'
import { Scene } from './scene'

export class Game {
  scene: Scene
  city: City

  activeToolId: string = ''

  constructor() {
    this.scene = new Scene()
    this.city = new City(16)

    this.scene.initialize(this.city)
    this.scene.onObjectSelected = selectedObject => {
      const { x, y } = selectedObject.userData
      const tile = this.city.data[x][y]
    }
    this.scene.start()

    // basic game loop, update every second
    setInterval(this.update.bind(this), 1000)
  }

  update() {
    this.city.update()
    this.scene.update(this.city.data)
  }

  setActiveTool(toolId: string) {
    this.activeToolId = toolId
    console.log(this.activeToolId)
  }
}
