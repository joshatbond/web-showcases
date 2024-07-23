import { createCity } from './city'
import { createScene } from './scene'

const scene = createScene()
const city = createCity(8)

scene.initialize(city)
scene.start()

window.scene = scene
