import { City } from './city'
import { Scene } from './scene'

export class Game {
  scene: Scene
  city: City

  constructor() {
    this.scene = new Scene()
    this.city = new City(8)

    this.scene.initialize(this.city.data)
    this.scene.start()
  }

  update() {
    this.city.update()
    this.scene.update(this.city.data)
  }
}
