import { isBuildingId } from './assets'
import { Game } from './game'

let selectedControl = document.getElementById('button-bulldoze')
const controls = document.querySelectorAll('.ui-button')
for (const control of controls) {
  control.addEventListener('click', () => {
    if (selectedControl) {
      selectedControl.classList.remove('selected')
    }
    selectedControl = control as HTMLButtonElement
    control.classList.add('selected')
    const toolId = control.id.split('-')[1]
    if (isBuildingId(toolId) || toolId == 'bulldoze') {
      window.game.setActiveTool(toolId)
    }
  })
}

window.game = new Game()
