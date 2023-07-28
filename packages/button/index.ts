import ddButton from './button.vue'
import type { App } from 'vue'
ddButton.install = function (app: App) {
    app.component(ddButton.name, ddButton)
}

export default ddButton