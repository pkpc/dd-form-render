import DButton from './components/DButton'
import type { App } from 'vue'

const components = [
    DButton
]
const install = (app: App) => {
    components.map((item) => {
        app.component(item.name, item)
    })
}
export default {
    install,
}
export {
    DButton
}