// import DButton from './DButton.vue'
// import type { App } from 'vue'
// DButton.install = function (app: App) {
//     console.log('DButton', DButton.name)
//     app.component(DButton.name, DButton)
// }
//
// export default DButton
import { App } from 'vue'
import DButton from './DButton.vue.js'

DButton.name = 'DButton'
DButton.install = function (app: App) {
    app.component('DButton', DButton)
}

export default DButton


